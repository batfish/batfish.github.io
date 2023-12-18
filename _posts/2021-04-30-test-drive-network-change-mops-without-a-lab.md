---
title: "Test drive network change MOPs without a lab"
date: "2021-04-30"
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

Imagine that you could predict and test the full impact of every single change to the network. Imagine also being able to do this within minutes, for the production network itself (not a small-scale replica), and without having to set up and maintain a test lab. Will this capability enable you to reduce the risk of outages and breaches? Will it enable you to be more responsive to the changing business needs of your organization?

**Change Reviews in Batfish Enterprise enable you to realize these agility and resiliency benefits by letting you test drive your change MOP (method of procedure) on a twin of your production network.** If you like the results, you can confidently push the change to production.

Let us consider an example change: adding a new subnet to the data center fabric. Your MOP may look like the following.

<table border="1" width="800" >
  <tbody>
    <tr>
      <td style="padding-left: 25px; padding-right: 25px;">
        <h4 style="text-align: center;">
          <b>&nbsp; MOP for adding a new subnet to a leaf in the DC fabric</b>
        </h4>
        User inputs
        <ul>
          <li><b>10.250.89.0/24</b>: The subnet prefix to add</li>
          <li><b>leaf89</b>: The leaf router where to add the subnet</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="padding-left: 25px; padding-right: 25px;">
        <h4 style="text-align: center;">
          <b>Pre-change tests</b>
        </h4>
        <ul>
          <li>Route to <b>10.250.89.0/24</b> should NOT already exist in the fabric. Log into a spine router, run “<b>show ip route 10.250.89.0/24</b>”, and check that the subnet prefix is not present.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="padding-left: 25px; padding-right: 25px;">
        <h4 style="text-align: center;">
          <b>Change commands</b>
        </h4>
        Log into <b>leaf89</b> and enter the following commands after double checking that <b>Ethernet7</b> is shutdown and <b>vlan 389</b> is unused.
        <br>
        <br>
          interface Ethernet7
          <br>&nbsp;&nbsp;switchport mode access
          <br>&nbsp;&nbsp;switchport access vlan 389
          <br>interface Vlan389
          <br>&nbsp;&nbsp;ip address 10.250.89.1/24
          <br>&nbsp;&nbsp;no shutdown
          <br>router bgp 65089
          <br>&nbsp;&nbsp;address-family ipv4 unicast
          <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;network 10.250.0.0/16
      </td>
    </tr>
    <tr>
      <td style="padding-left: 25px; padding-right: 25px;">
        <h4 style="text-align: center;">
          <b>Post-change tests</b>
        </h4>
        <ul>
          <li>Route to <b>10.250.89.0/24</b> should exist in the fabric. Log into a spine router, run “<b>show ip route 10.250.89.0/24</b>”, and check that the subnet prefix exists.</li>
          <li>Route to <b>10.250.0.0/16</b> aggregate that covers the subnet should exist at the border routers and the firewall. Log into a border router, run “<b>show ip route 10.250.0.0/16</b>”, and check that the aggregate route exists.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="padding-left: 25px; padding-right: 25px;">
        <h4 style="text-align: center;">
          <b>Rollback commands and tests</b>
        </h4>
        <br>// Skipped for this article
        <br> // Batfish Enterprise can help test the rollback procedure as well
      </td>
    </tr>
  </tbody>
</table>

 

To test drive this MOP in Batfish Enterprise, you would first specify the planned implementation. Simply select the device from the list and enter the configuration commands planned for it.  When you do that, Batfish Enterprise will check that the commands are valid. In the screenshot below, for instance, it is warning that the interface address is not correctly specified.

![](/assets/images/Screen-Shot-2021-04-29-at-7.30.23-AM.png){:width="800px"}

You would next specify your tests. Batfish Enterprise test templates allow you to check all manners of network behaviors. For our example change, as shown below, you would use the **Devices Have Routes** template to test that the subnet route is not present before the change (a pre-change test) and is present after the change (a post-change test).

![](/assets/images/Screen-Shot-2021-04-29-at-7.33.55-AM.png){:width="800px"}

Compared to what you might do during the maintenance window, this test will check for the presence of the route on all devices, not just one or two you might log into while making the change. You would similarly specify the second post-change test to ensure that the /16 aggregate is present on the border routers and the firewall.

After entering the configuration commands and tests, you tell Batfish Enterprise to evaluate the change. If a test fails, Batfish Enterprise will show you which devices are failing and why. Below, we see that it is showing that the second test (about the aggregate) is failing, and the aggregate prefix is not present on the border routers and the firewall.

![](/assets/images/Screen-Shot-2021-04-29-at-7.37.15-AM.png){:width="800px"}

If you had applied this change during the maintenance window, you’d have to rollback the change, debug it, and then schedule it for a future maintenance window. With Batfish Enterprise, you make such discoveries ahead of time, and the change will be successfully executed in one maintenance window.

Based on the information provided by Batfish Enterprise, you’d quickly realize that the test is failing because the subnet prefix (**10.250.89.0/24**) is not covered by any of the existing aggregates announced by the border leafs. Past subnet additions succeeded because those prefixes were drawn from existing aggregates.  The fix is easy once you make this discovery. You would add another aggregate to the list announced by the two border leafs and update the change specification within Batfish Enterprise. The screenshot below shows the change commands for **bl02**, one of the border leafs.

![](/assets/images/Screen-Shot-2021-04-29-at-7.38.21-AM.png){:width="800px"}

When you run validation again now, Batfish Enterprise will consider the combined impact of changes across all devices and tell you if any test is still failing.

Batfish Enterprise offers two additional ways for you to gain confidence in the change. If you have defined network-level policies—-behaviors that must always be true of the network (e.g., the corporate Website should always be accessible from the Internet)—-it will check that the change does not violate any of those.

Further, it enables you to see the full impact of the change, including changes in RIBs, FIBs, and end-to-end connectivity. The two screenshots below show that 1) two new prefixes (the subnet prefix and the aggregate) will be added to leaf devices, and 2) new flows will be allowed from the Internet to **leaf89** (where the subnet was added). The connectivity between the internet and other leafs is unchanged. **Using such views, you can easily verify that the change has exactly the intended impact--no more, no less.**

![](/assets/images/Screen-Shot-2021-04-29-at-7.38.38-AM.png){:width="800px"}

![](/assets/images/Screen-Shot-2021-04-29-at-7.39.09-AM.png){:width="800px"}

You are now done. **Within a matter of minutes, you have validated that your planned change passes your tests, does not violate your network policy, and has exactly the intended impact. You can now enter the maintenance window with confidence!**

* * *

Check out these related resources:

- [Demo video](https://www.youtube.com/watch?v=I_3N72LTj3c&ab_channel=Intentionet) that shows this specific change example in action.
- [Demo video](https://www.youtube.com/watch?v=K-2WYakenxI&ab_channel=Intentionet) that shows even automated changes can be fully tested before deployment.
