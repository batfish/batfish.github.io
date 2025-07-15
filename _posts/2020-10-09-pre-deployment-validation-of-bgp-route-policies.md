---
title: "Pre-deployment validation of BGP route policies"
date: "2020-10-09"
author: Todd Millstein
excerpt: <p> We discuss how validating route policies prior to deployment can prevent outages big and small.
tags:
  - "batfish"
  - "bgp"
  - "networkautomation"
  - "networkvalidation"
  - "predeployment"
  - "route-leak"
  - "route-policy"
  - "verification"
---

A common culprit behind some of the biggest outages in the Internet is misconfigured BGP route policies. For example:

- [BGP Leak Causing Internet Outages in Japan and Beyond](https://www.bgpmon.net/bgp-leak-causing-internet-outages-in-japan-and-beyond/)
- [How a Tiny Error Shut Off the Internet for Parts of the US](https://www.wired.com/story/how-a-tiny-error-shut-off-the-internet-for-parts-of-the-us/)
- [Telia engineer error to blame for massive net outage](https://www.theregister.com/2016/06/20/telia_engineer_blamed_massive_net_outage/)

<!--  
![BGP Route Leak](/assets/images/bgp-route-leak-e1602110402996.png) -->

Such outages typically occur when route policy configuration changes end up accidentally leaking routes or accepting routes they shouldn't.

That these events occur regularly and across a wide swath of networks reinforces our belief that getting network configuration right is a tools problem, not an experience or training problem. Validating network configuration in general, and BGP route policies in particular, is a highly complex task for which engineers need better tools. While network engineers often know what their route policies should or should not do (e.g., see [MANRS guidelines](https://www.manrs.org/)), ensuring that the policy implementation matches their intent is notoriously hard.

[Batfish](https://github.com/batfish/batfish) solves this problem by providing two ways to analyze routing policies:

1. Test the policy against a specific set of input routes with _testRoutePolicies_
2. Find (search for) a specific set of input routes that trigger a specific action by the policy with _searchRoutePolicies_ (new!).

These questions bring to route policies similar capabilities that you may already know and love from Batfish for [analyzing ACLs and firewall rules](https://github.com/batfish/pybatfish/blob/master/jupyter_notebooks/Analyzing%20ACLs%20and%20Firewall%20Rules.ipynb). They make it easy to find bugs in routing policies and get strong correctness guarantees, all before you deploy changes to the network.

Here are just a few examples of the kinds of intents that you can validate with these analyses:

- Deny all incoming routes with private addresses
- Only permit incoming routes if they have the correct origin AS
- Tag incoming routes from a neighbor with a specific community
- Set the local preference for all customer routes to 300
- Advertise only prefixes that we (and our customers) own

### Testing Route Policy Behavior

The _testRoutePolicies_ question enables you to test the behavior of a route policy for specific routes of interest.  You can find out,

- if the route will be permitted or denied by the policy.
- if permitted, how attributes such as communities are transformed.

For example, to test the "_deny all incoming routes with private addresses_" intent you would run _testRoutePolicies_ on routes with prefixes in the private address space and check that all of them are denied.

Let’s take a look at an example route-policy from_customer and evaluate its behavior with testRoutePolicies.

```
route-map from_customer deny 100
 match ip address prefix-list private-ips
!
route-map from_customer permit 200
 match ip address prefix-list from44
 match as-path origin44
 set community 20:30
 set local-preference 300
!
route-map from_customer deny 300
 match ip address prefix-list from44
!
route-map from_customer permit 400
 set community 20:30
 set local-preference 300

ip prefix-list private-ips seq 5 permit 10.0.0.0/8 ge 8
ip prefix-list private-ips seq 10 permit 172.16.0.0/28 ge 28
ip prefix-list private-ips seq 15 permit 192.168.0.0/16
!
ip prefix-list from44 seq 10 permit 5.5.5.0/24 ge 24
!
ip as-path access-list origin44 permit _44$
```

```
inRoute1 = BgpRoute(network="10.0.0.0/24", originatorIp="4.4.4.4", originType="egp",protocol="bgp")
result = bfq.testRoutePolicies(policies="from_customer",direction="in",
 inputRoutes=[inRoute1]).answer().frame()
print(result)

 Node     Policy_Name    Input_Route                                                                                                                                                             Action  Output_Route Difference

0  border1  from_customer  BgpRoute(network='10.0.0.0/24', originatorIp='4.4.4.4', originType='egp', protocol='bgp', asPath=[], communities=[], localPreference=0, metric=0, sourceProtocol=None)  DENY    None         None
1  border2  from_customer  BgpRoute(network='10.0.0.0/24', originatorIp='4.4.4.4', originType='egp', protocol='bgp', asPath=[], communities=[], localPreference=0, metric=0, sourceProtocol=None)  DENY    None         None
```

As you can see, Batfish correctly determines that the 10.0.0.0/24 route advertisement will get denied by the policy.

This capability is extremely useful when designing (or changing) your routing policy. For a concrete set of routes you can determine the specific behavior of the routing policy. The _testRoutePolicies_ question achieves this by simulating the behavior of the route policy on input routes.

### Searching for Route Policy Misbehaviors (Verification)

Testing is extremely useful for debugging route policies, but it can only guarantee that the policy behaves correctly on the specific routes that are tested.  The space of potential input routes is so large, it would be infeasible to test each one individually. This is where _searchRoutePolicies_ comes into play. It allows you to verify the policy against your intent, across all possible routes. The _searchRoutePolicies_ question has been recently added to Batfish and can be used to analyze a host of common route policy behaviors.

The _searchRoutePolicies_ question provides comprehensive guarantees by searching for routes that cause a route policy to behave in a particular way.  You start by describing a space of potential input routes---using any combination of prefix ranges, a list of allowed communities, an AS-path regular expression, etc.---along with an action (permit or deny).  Batfish will search this space of potential input routes and identify a route, if one exists, for which the route policy you are evaluating takes the specified action.

For example, to verify the "_deny all incoming routes with private addresse_s" intent, you would specify the space of interest as all routes with private addresses and search if anything in that space is permitted.  If Batfish returns any route, that indicates that the routing policy violates your intent. Conversely, if there are no results then you can be sure that the intent is satisfied, and that all routes with private addresses are indeed denied.

```
\# Define the space of private addresses and route announcements
privateIps = ["10.0.0.0/8:8-32", "172.16.0.0/28:28-32", "192.168.0.0/16:16-32"]
inRoutes1 = BgpRouteConstraints(prefix=privateIps)

\# Verify that no such announcement is permitted by our policy
result = bfq.searchRoutePolicies(policies="from_customer",
 inputConstraints=inRoutes1,
 action="permit").answer().frame()

print(result.loc[0])

Node         border2
Policy_Name  from_customer
Input_Route  BgpRoute(network='192.168.0.0/32', originatorIp='0.0.0.0', originType='igp', protocol='bgp', asPath=[], communities=[], localPreference=0, metric=0, sourceProtocol=None)
Action       PERMIT
Output_Route BgpRoute(network='192.168.0.0/32', originatorIp='0.0.0.0', originType='igp', protocol='bgp', asPath=[], communities=\['20:30'\], localPreference=300, metric=0, sourceProtocol=None)
Difference   BgpRouteDiffs(diffs=\[BgpRouteDiff(fieldName='communities', oldValue='\[\]', newValue='\[20:30\]'), BgpRouteDiff(fieldName='localPreference', oldValue='0', newValue='300')\])
```

Batfish has found a route advertisement 192.168.0.0/32 that will be allowed by the routing policy, despite our intent being for it to be denied. There may be multiple route advertisements that violate our intent, Batfish picks one as an example to highlight the error. If you look closely at the routing policy, the route-map from_customer is going to deny routes that match the prefix-list private-ips. The last entry in that prefix-list is incorrect. It is missing the "ge 16" option. As defined, that entry only matches the exact route 192.168.0.0/16, which means any other prefix from that 192.168.0.0/16 space will not be matched and therefore not be denied by the route-map.

```
route-map from_customer deny 100  match ip address prefix-list private-ips

ip prefix-list private-ips seq 5 permit 10.0.0.0/8 ge 8 ip prefix-list private-ips seq 10 permit 172.16.0.0/28 ge 28
ip prefix-list private-ips seq 15 permit 192.168.0.0/16
```

You can also use _searchRoutePolicies_ to ensure that your routing policy is correctly transforming routes it accepts. To do this, you specify a space of output routes, using a combination of prefix ranges, a list of communities, AS-path regular expressions, etc…, along with the space of input routes. Batfish will return any input route that after being transformed by the routing policy falls in the space of the output routes. This capability can be used to validate an intent like "_set the local preference for all customer routes to 300_" by searching for input customer routes that do not land in the output space of routes with a local preference of 300.

You may be curious how this magic works under the hood--after all, the space of routes can be huge, representing billions of potential routes. This is where the power of Batfish comes in. Batfish encodes the route policy, which is essentially a function that maps input routes to output routes, as a mathematical equation, with a series of constraints. Using a similar algorithm to how we search for packets that meet specific criteria, Batfish solves this mathematical equation.

If you have any questions, or have complex routing policies that you need help analyzing get in touch via [GitHub](https://github.com/batfish/batfish) or [Slack](https://join.slack.com/t/batfish-org/shared_invite/enQtMzA0Nzg2OTAzNzQ1LTcyYzY3M2Q0NWUyYTRhYjdlM2IzYzRhZGU1NWFlNGU2MzlhNDY3OTJmMDIyMjQzYmRlNjhkMTRjNWIwNTUwNTQ).

### Examples and More Information

To learn more, check out these resources:

1. Our new [Jupyter notebook](https://github.com/batfish/pybatfish/blob/master/jupyter_notebooks/Analyzing%20Routing%20Policies.ipynb), which provides examples of using both _testRoutePolicies_ and _searchRoutePolicies_ to validate route policies.
2. A [NANOG talk](https://www.youtube.com/watch?v=rxqEe7vztRE) on using _testRoutePolicies_ for pre-deployment validation.
3. [Documentation](https://pybatfish.readthedocs.io/en/latest/notebooks/routingProtocols.html) for the questions.
