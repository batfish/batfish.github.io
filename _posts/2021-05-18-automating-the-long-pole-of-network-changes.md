---
title: "Automating the long pole of network changes"
date: "2021-05-18"
author: Matt Brown
tags:
  - "batfish"
  - "batfish-enterprise"
  - "change-automation"
  - "change-testing"
  - "change-validation"
  - "network-automation"
  - "network-validation"
  - "predeployment-validation"
---

When it comes to automating network changes, most network engineers want to start with automatic config generation and deployment. It just feels like that is the heart of the challenge, and it certainly feels like a fun thing to do.

**But assume for a moment that you’ve automated config generation and deployment. Have you now significantly reduced the time it takes to service change requests?**

If your network is like the many that we  (or [the good folks at NetworkToCode](https://www.youtube.com/watch?v=qw6jKa7yLBQ)) work with, chances are that the answer is no. There are several critical and critical-path tasks that have not been automated, including:

- Ensuring that the generated change is correct
- Reviewing and approving the change
- Testing the impact of the change post deployment (post-change testing)

Per [Amdahl’s law](https://en.wikipedia.org/wiki/Amdahl%27s_law), unless you automate these tasks too, your end-to-end gains from network automation will be limited. By automating config generation and deployment, you have likely shaved off only tens of minutes from the time it takes you to service a request, without making a big dent into the end-to-end time. This effect is illustrated in the figure below.

![](/assets/images/Screen-Shot-2021-05-11-at-1.40.06-PM.png){:width="800px"}

At the same time, without automating testing, the risk of a bad change making it to the network is still high. You cannot count on the change generation script always generating correct changes. It is all too easy for this script to overlook a legacy snowflake in the network or interact poorly with some recent changes (perhaps made manually). You thus need to still validate that the auto-generated change is correct and, for big changes, have a colleague review them for added assurance. This is an error prone task given the complexity of modern networks.

**Change Reviews in Batfish Enterprise enable you to fully automate change testing, attack the long poles in your change workflows, and make network changes more reliable.**

Let us illustrate how they work via an example: Allowing access to a new service from the outside. The service request may look like the following:

<table style="width: 50%;" border="1" align="center"><tbody><tr><td style="padding-left: 25px; padding-right: 25px;"><em>ticket_id</em></td><td style="padding-left: 25px; padding-right: 25px;">tkt1234</td></tr><tr><td style="padding-left: 25px; padding-right: 25px;"><em>service_name</em></td><td style="padding-left: 25px; padding-right: 25px;">NewService</td></tr><tr><td style="padding-left: 25px; padding-right: 25px;"><em>destination_prefixes</em></td><td style="padding-left: 25px; padding-right: 25px;">10.100.40.0/24, 10.200.50.0/24</td></tr><tr><td style="padding-left: 25px; padding-right: 25px;"><em>ports</em></td><td style="padding-left: 25px; padding-right: 25px;">tcp/80, tcp/8080</td></tr></tbody></table>

 

Your change generation script will use the request parameters to generate the configuration commands for one or more devices. For example, it may generate the following change to the Palo Alto firewall at the edge of the network:

set service S_TCP_80 protocol tcp port 80
set service-group SG_NEWSERVICE members S_TCP_80
set service S_TCP_8080 protocol tcp port 8080
set service-group SG_NEWSERVICE members S_TCP_8080

set address tkt123-dst1 ip-netmask 10.100.40.0/24
set address-group tkt123-dst static tkt123-dst1
set address tkt123-dst2 ip-netmask 10.200.50.0/24
set address-group tkt123-dst static tkt123-dst2

set rulebase security rules tkt123 from OUTSIDE
set rulebase security rules tkt123 to INSIDE
set rulebase security rules tkt123 source any
set rulebase security rules tkt123 destination tkt123-dst
set rulebase security rules tkt123 application any
set rulebase security rules tkt123 service SG_NEWSERVICE
set rulebase security rules tkt123 action allow

This change may be generated using Jinja2 templates, an internal source-of-truth like Netbox, or the Palo Alto Ansible module. Regardless of how it is generated, you can submit it to Batfish Enterprise and analyze it using three criteria.

### Criterion 1: The change should have the intended behavior

The first criterion is that the change should result in the intended behavior. In our example, that means the firewall should allow the traffic to the service and external sources should be able to reach the service. Batfish Enterprise provides a variety of test templates that enable you to validate the network behavior before and after the change (pre- and post-change tests).

For our example, you would use the **Service Accessibility** template to test that the service is not accessible from the Internet before the change and is accessible after the change. This test can be expressed using the following YAML:

![](/assets/images/Screen-Shot-2021-05-11-at-2.43.29-PM.png){:width="600px"}

You would also use the **Cross-Zone Firewall Policy** template to test firewall behavior for service traffic from outside zone to inside zones. It should not allow this traffic before the change and allow it after the change.  Both end-to-end service accessibility and firewall-focused tests are useful because they can yield different results. The firewall-focused test may pass and the end-to-end test may still fail if the traffic is blocked elsewhere on the path.

You would generate these change-behavior tests as part of change generation. Thus, based on the service request parameters, you are generating the change and the tests for the change.

### Criterion 2: The change should not violate network policy

In addition to the change meeting its behavioral specification, you need to also ensure that it does not violate any network policy. Network policies are behaviors that must always be true, independent of the change. For example, certain subnets must never be accessible from the Internet and access to the main corporate Website must never be blocked. It is possible to have a situation where change behavior tests pass but a key network policy is violated, for instance, if request parameters are wrong. Such changes must not reach the network.

With Batfish Enterprise, once you’ve configured the network policies, they are evaluated automatically for each change. Policies use the same basic templates as change behavior tests. A policy that certain services must never be accessible from the Internet will use the **Service Protection** template as follows:

![](/assets/images/Screen-Shot-2021-05-11-at-2.45.28-PM.png){:width="600px"}

### Criterion 3: The change should not cause collateral damage

A final criterion to build confidence in the change is testing that it does not do collateral damage, e.g., accidentally allowing more traffic than intended.  Batfish Enterprise can predict the full impact of the change, including how the routing tables will differ and how traffic will be permitted or blocked by it. The screenshot below shows how the network connectivity is impacted by our example change. We see that the Internet can now reach **leaf40** and **leaf50**, where the two prefixes are hosted, and no other traffic will be allowed or denied as a result of the change.

![](/assets/images/Screen-Shot-2021-05-11-at-2.50.54-PM.png){:width="800px"}

These differences enable you to determine if the change has exactly the impact you want--no more, no less. Using Batfish Enterprise APIs you can assert that the change does not allow traffic to any leaf routers other than the ones corresponding to the service request or that the routing tables are not altered on any router.

### Rapid iteration

When you evaluate a change per the criteria above, you may find that one or more tests fail. Batfish Enterprise helps you debug such failures quickly. For our example, we may find that while we successfully opened the firewall, end-to-end connectivity is still missing. Batfish Enterprise will then output (screenshot below — the same information is available programmatically) an example flow (within the traffic we intended to allow) that cannot reach NewService. It will also show that this traffic is being dropped at the border routers and that there is in fact a different flow that can reach the service. We can see that the difference between these two flows is the destination port: **tcp/8080** versus **tcp/80**.

![](/assets/images/Screen-Shot-2021-05-11-at-2.54.51-PM.png){:width="800px"}

What is happening here is port 8080 is not open at the border routers. Thus, we have a situation where some traffic can reach NewService and some cannot. Without the comprehensive analysis provided by Batfish Enterprise, you may incorrectly infer that the change is correct.

**Importantly, Batfish Enterprise is finding such problems with the planned change prior to the maintenance window.** Without it, you may discover such problems above during the maintenance window. At that point, you’d have to roll back the change, debug it, and schedule it for another maintenance window. That would have significantly stretched the service request time.

After determining the root cause, you could modify your change generation script and rerun all tests with its new output. Or, because script modifications take time, you may want to first determine the correct change manually to close the service request in a timely manner. Batfish Enterprise lets you mix automatic and manual changes and test their combined impact.

### Simplified reviewing

To facilitate change reviews, you can attach the results of all the change behavior tests, the results of network policy evaluation, and the full impact report of the change to the service request ticket. This information makes it super easy for the reviewer to approve the change. Once approved, you deploy the change to the production network with the confidence that it will work exactly as intended.

### Summary

Chances are that your team spends more time on ensuring that the config change is correct than on generation and deployment. To realize the end-to-end gains from automation, you must automate not just config generation and deployment, but also testing. Batfish Enterprise enables you to build an end-to-end automation pipeline that automates testing and simplifies reviews. The result is a network that moves fast and does not break.

* * *

Check out these related resources

- [Demo video](https://www.youtube.com/watch?v=aupJMkfuHR8&ab_channel=Intentionet) that shows this specific example in action
