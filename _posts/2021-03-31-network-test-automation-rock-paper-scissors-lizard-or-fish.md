---
title: "Network test automation: Rock, Paper, Scissors, Lizard, or Fish?"
date: "2021-03-31"
author: Chirag Vyas
tags:
  - "batfish"
  - "change-automation"
  - "change-testing"
  - "change-validation"
  - "emulation"
  - "gns3"
  - "network-automation"
  - "network-change-automation"
  - "network-ci-cd"
  - "network-validation"
  - "network-cicd"
  - "predeployment-validation"
  - "simulation"
---

When building a network automation pipeline, one of the most important questions to consider is: How do you test network changes to prove that they will work as intended and won’t cause an outage or open a security hole? In a world without automation, this burden falls on network engineers and approval boards. **But in a world where network changes are automated, testing of changes must be automated as well.**

There are multiple types of testing that you should consider, such as:

- Data validation (e.g., the input for an IP address is a valid IP address)

- Syntax validation (e.g., configuration commands are syntactically valid)

- Network behavior validation (e.g., firewall rule change will permit intended flows)

I will focus on network behavior validation in this blog. It provides the strongest form of protection by validating the end-to-end impact of changes.

How can you validate network behavior that a change will produce _before_ the change is deployed to the production network? You have two options.

- You can build a lab that **emulates** the production network, using physical or virtual devices, and apply and test the changes there.

- You can **simulate** the change using models of network devices.

GNS3 is a popular emulation tool, and Batfish is a comprehensive, multi-vendor simulation tool. The title of this blog post is a play on their logos (and of course [Big Bang Theory](https://bigbangtheory.fandom.com/wiki/Rock,_Paper,_Scissors,_Lizard,_Spock)), though the discussion below applies equally to other emulation tools such as EVE-NG and VIRL.

As Batfish developers, we are frequently asked if engineers need both tools. The answer is: Both tools should be part of your testing toolkit as they are built to solve different problems. The table summarizes our view which I’ll discuss in more detail below. Before proceeding, I should add that GNS3 is an excellent tool and [we use it extensively to build and test high-fidelity device models in Batfish](/2020/12/18/validating-the-validator.html).

<table border="2" width="800">
  <tbody>
    <tr>
      <td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">
      </td>
      <td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><img class="alignnone wp-image-2048" src="/assets/images/batfish-full-500px.png" alt="batfish logo" width="90"></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><img class="alignnone wp-image-2049" src="/assets/images/gns3-logo.png" alt="gns3 logo" width="70"></td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>Correctness guarantees</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✘</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>Configuration compliance and drift</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✘</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>High-level, vendor-neutral APIs</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✘</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>Embed in CI</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">⚠ (Slow, resource heavy)</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>Analyze production network’s twin</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">⚠ (Rarely possible)</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>Test new software versions and features</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✘</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;"><h4>Test performance</h4></td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✘</td><td style="text-align: center; padding-top: 15px; padding-bottom: 15px;">✔ (Some scenarios)</td></tr><tr><td style="text-align: center; padding-top: 15px; padding-bottom: 15px; font-size: 20px;" colspan="3"><b>Our recommendation</b>: Use the fish for day-to-day configuration changes, and use the lizard for qualifying new software /assets/images and lighting up new features.</td></tr></tbody></table>

### Unique Batfish strengths

Batfish has three unique strengths. First, only Batfish can provide correctness guarantees that span all possible flows. For instance, when opening access to a new /24 prefix, you may want to know that no port to that destination prefix is blocked from any source, or that you have not accidentally impacted any other destination. Such guarantees are not possible in GNS3 but are almost trivial in Batfish.

Second, with Batfish you can not only test that the configuration produces the right behavior, but also that it complies with your site standards and has not drifted from its desired state. Batfish builds a vendor-neutral configuration model that you can query to validate, for instance, that the TACACS servers are correct and that the correct route map is attached to each BGP peer. This is not possible with GNS3.

Finally, while both tools will let you check network behaviors by running traceroutes and examining RIBs, only Batfish offers simple, vendor-neutral APIs. These APIs make it trivial, for instance, to check that packets take all expected paths (ECMP) and understand why a traceroute path was taken. Doing such inferences in GNS3 will take lots of careful test generation, vendor-specific parsing of RIBs and "show" data, and manual correlation.

> **Thus, Batfish enables comprehensive testing with strong correctness guarantees and vendor-neutral APIs. As we’ll see next, it also enables you to mimic your full production network and embed testing in your CI framework.**

### Overlapping capabilities but advantage Batfish

There are two testing goals for which you may consider either tool in theory, though Batfish is the pragmatic choice. First, you can invoke either tool in your CI (continuous integration) framework such that the analysis is run automatically for each change. Because of the time it takes to run GNS3 tests and the amount of resources it will consume, such usage is only a theoretical possibility for most networks. With Batfish today, many users run a wide array of tests, which finish within minutes for even networks with thousands of devices.

Second, ideally, you want the tests to be run in an environment that closely mimics your production network. Creating an exact replica of the production network is nearly impossible with GNS3. Software /assets/images may not be available for some devices; they are certainly not available for cloud gateways. Or, you may run into other limitations such as the number of allowed ports or different interface names. You will need to get around such limitations by creating a smaller network and modifying your network configs, which leaves testing gaps. Batfish can easily mimic your entire production environment, including cloud deployments.

### Unique GNS3 strengths

A unique strength of GNS3 is that it can help qualify software /assets/images that you are going to run in production. It can test that the new versions of device software run in a stable manner and that features that you haven’t used before work as expected.

GNS3 can also help you test some aspects of performance. You can test that the device can process large routing tables (though not that it does not drop packets under high load, for which you need real hardware). You can also emulate different link delays and loss rates to evaluate the impact of network conditions on, for instance, on event monitoring systems.

One observation I make is that these types of tests do not need to be done frequently. They are needed only when you upgrade software or change network design to use new features. They are not needed for day-to-day changes such as adding firewall rules, updating route policies, or provisioning new racks.

### Summing it up

The choice of network testing tool depends on testing goals. To flag potential bugs in vendor software, you need GNS3. To find errors in your network configuration, you need Batfish. Both testing goals are important. **Thus, we recommend using the lizard to qualify software /assets/images and the fish for day-to-day network configuration changes.** That way you will lower the risk of software bugs causing network outages, and you will have configuration change testing that is comprehensive and production-scale.

 

_Acknowledgement: Thanks to [Titus Cheung](https://www.linkedin.com/in/titus-cheung-ba62a58/) (HSBC Equities Regional Infrastructure Manager and Architect) for sharing his insights on where each tool applies and providing feedback on this article._
