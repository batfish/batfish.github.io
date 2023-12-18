---
title: "Don't be afraid of (network) change"
date: "2021-03-10"
author: Ratul Mahajan
tags:
  - "batfish"
  - "batfish-enterprise"
  - "change-automation"
  - "change-testing"
  - "change-validation"
  - "network-automation"
  - "network-change-automation"
  - "network-ci-cd"
  - "network-validation"
  - "network-cicd"
  - "predeployment-validation"
---

Companies large and small crave agile, resilient networks. They crave infrastructure that adapts rapidly to business needs without outages or security breaches. But changing the network is a risky proposition today, be it adding a firewall rule or provisioning a new rack. 50-80% of network outages are caused by bad network configuration changes. This high level of risk forces networking teams to tread carefully (and slowly) and prevents them from automating network changes.

No wonder Dilbert does not want to be the one updating the firewall.

 

![Dilbert Firewall Cartoon](/assets/images/AML-25765_2942121_mutable_color.jpg)

Network changes today center around MOPs (method of procedure) that outline the steps to implement a change, for instance:

- Run pre-change test (e.g. “show” commands) to test that the network is ready for the change
- Enter configuration commands that implement the change
- Run post-change tests to confirm that the change worked
- If something went wrong, roll back the change

MOPs are built by network architects and engineers based on their knowledge of the network and are reviewed by Change Approval Boards (CAB).

In any large network that has been operational for months, and is managed by multiple engineers, there invariably are special cases (“snowflakes”) that are all-too-easy for engineers and the CAB to miss. The inability of humans to consider all such cases is what creates the risk of change-induced outages.

For some assurance of correctness, MOPs for complex changes are tested in physical and virtual labs and the test reports are included in the review process. While labs are helpful, they rarely mimic the full production network (especially the snowflakes). It is also impossible in a lab to run all test cases needed to fully validate a change—-fully validating a firewall change to isolate two network segments must consider billions of test packets. The gap between the lab and production networks and the incompleteness of tests, means that the CAB does not have a complete view of the impact of the change. The risk of them approving an incorrect change is still high.

**Today, it is almost impossible to guarantee that network changes won’t disrupt critical services or open security holes.**

We built the Change Review workflow in Batfish Enterprise for provably safe network changes. This feature enables network engineers and operators to comprehensively validate MOPs. You specify the change commands and pre- and post-change tests (interactively or via API calls). Batfish Enterprise then simulates your full production network (with all of its snowflakes), predicts the full impact of the change (for all traffic), and flags any test failures.

You can now be confident that the planned change is correct and can be safely deployed to the network.  You can also attach the proof-of-correctness test reports to change management tickets, making CAB reviews easier and faster.

**With the new Change Review workflow in Batfish Enterprise, you can ensure that the security and availability of the network is never compromised by a configuration change.**

The rigorous validation of the MOP and full visibility into the impact of the change will enable you to reduce outages and dramatically increase change velocity. These correctness guarantees are also the foundation upon which you can automate the network change workflow.

See the solution in action in [these videos](https://youtube.com/playlist?list=PLUXUN_5CNTWLbcrA0m37TBVM_ccfrGiYt).

<table><tbody><tr><td><iframe src="https://www.youtube.com/embed/I_3N72LTj3c" width="350" height="200" frameborder="0" allowfullscreen="allowfullscreen"></iframe></td><td><iframe src="https://www.youtube.com/embed/aupJMkfuHR8" width="350" height="200" frameborder="0" allowfullscreen="allowfullscreen"></iframe></td></tr></tbody></table>

