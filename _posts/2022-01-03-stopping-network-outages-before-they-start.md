---
title: "Stopping Network Outages Before They Start"
author: Todd Millstein
date: "2022-01-03"
tags:
  - "batfish"
  - "change-automation"
  - "change-testing"
  - "change-validation"
  - "network-automation"
  - "network-validation"
  - "predeployment-validation"
---

How do you detect buggy network configuration changes?  My guess is that you use post-deployment checks and monitoring systems. And you should!  But if that’s the only thing you’re doing, then you are unnecessarily risking network outages, breaches, and more. Those tools help you cure incidents after they occur, but they do nothing to prevent buggy changes from being deployed in the first place.

**Of course, we all know that an ounce of prevention is worth a pound of cure, and we live by that motto in many walks of life.**  The medical domain is an obvious example, where preventative measures -- physical exams, vaccinations, blood tests -- are the norm and save lives every day.  The software industry likewise puts enormous effort into preventing errors: each code change must pass a suite of behavioral tests and static checks before it is deployed to production. These tools prevent critical software bugs every day.

**Like software, network automation pipelines can and should use behavioral tests and static checks to prevent configuration errors from reaching the production network. ** There are a variety of tools available to support these tasks.  Network emulation (e.g., [GNS3](https://www.gns3.com/) and [containerlab](https://containerlab.srlinux.dev/)) and simulation (e.g., [Batfish](https://www.batfish.org)) enable behavioral testing.  Configuration checkers (e.g., [Batfish](https://www.batfish.org) again) perform static checks.

Adding pre-deployment prevention into your workflow has huge benefits over relying solely on post-deployment cures:

- **Incident Prevention:**  Well, this first one is obvious but is also the most important -- you can now prevent incidents from ever occurring, and hence completely avoid the damage that they would otherwise cause.  Even with the best post-deployment checks, some incidents will cause significant damage. This damage may be due to a delay in detecting the problem, and even if the problem is detected quickly, it may still take time to mitigate successfully. A prominent recent example is [Facebook’s global outage](https://engineering.fb.com/2021/10/04/networking-traffic/outage) in October 2021 due to a buggy configuration change. While the problem was detected soon after the change was deployed to the network, it took six hours to bring the network back to a fully functional state.
- **Root-cause Diagnosis: ** Root-cause analysis is much easier to do for configuration bugs identified through pre-deployment checks.  As an example, consider the lowly “fat finger” error, where a name is misspelled.  This error can manifest in myriad ways in the live network, depending on the kind of name that is misspelled, the context in which it occurs, and the particular vendor.  Batfish recently found a misspelled route-map name in a customer network that would have caused a forwarding loop.  If the loop had been detected in the live network, diagnosing its root cause would have been very difficult.  In contrast, a pre-deployment check that looks for undefined route-map names in the configuration can directly identify the bug independent of how it will affect the network’s behavior.
- **Incident Remediation:**  Once a problem is discovered and diagnosed, it has to be fixed. Again, the pre-deployment setting dramatically simplifies this task. When an issue arises in the live network, it must be mitigated as soon as possible to minimize (further) damage. Commonly this is done by rolling back to an old state.  However, rollbacks can be expensive and they also must be done with great care for fear of introducing a new problem into the network. In the pre-deployment setting, the buggy configuration change hasn’t been deployed yet, so there is nothing to roll back. Further, once an appropriate update to the configuration change has been made, that version is itself validated with pre-deployment checks, ensuring that it truly fixes the problem and introduces no new problems.

In summary, pre-deployment validation is a must-have tool for any network automation pipeline.  Most network incidents are caused by buggy configuration changes, and catching them before deployment is orders-of-magnitude cheaper than detecting and remediating them in the live network.  Add a critical layer of prevention to your network – reach out and we’ll help you get started today!

Related resources:

- [Test drive network change MOPs without a lab](/2021/04/30/test-drive-network-change-mops-without-a-lab.html): Learn how to test the impact of changes using Batfish Enterprise
- [The networking test pyramid](/2021/06/16/the-networking-test-pyramid.html): Learn how to develop a comprehensive test suite for  network configurations
- [Network test automation: Rock, Paper, Scissors, Lizard, or Fish?](/2021/03/31/network-test-automation-rock-paper-scissors-lizard-or-fish.html) Learn the differences between simulation and emulation for behavior testing
