---
title: "Incrementally automating your network"
date: "2021-11-30"
author: Ratul Mahajan
tags:
  - "batfish"
  - "change-automation"
  - "change-testing"
  - "change-validation"
  - "network-automation"
  - "network-validation"
  - "predeployment-validation"
---

Network automation can significantly benefit your organization. [Gartner found that](https://www.networkcomputing.com/networking/five-things-you-need-do-avoid-network-automation-failures) automating 70% of the network changes reduces outages by 50% and speeds service delivery by 50%. But achieving these results is elusive for most organizations—-they never get to the point where a substantial fraction of changes are successfully automated. A key hurdle is creating a reliable SoT (Source of Truth), a herculean task, especially for brownfield networks. This article outlines an incremental approach to network change automation that is not gated on a fully-fleshed SoT.

Let us begin by discussing the traditional “SoT-first” approach to network automation and its limitations. This approach proceeds as follows:

1. Build an SoT using something like Nautobot or NetBox.
2. Build jinja2 templates that can generate device configurations using the SoT.
3. Iterate on Steps 1 and 2 until generated configs are “close enough” to running configs.
4. Develop scripts to modify the SoT and templates to support common network changes.
5. Develop scripts to deploy configuration and run pre- and post-checks.

The promise here is that, once you have done these steps, you’d be able to automatically update the network for common change requests.

This SoT-first approach is incredibly difficult to execute, however. Any long-running network will have variations and snowflakes, and it can be difficult to capture the true values for various settings and develop the right configuration templates. If you have three vintages of leaf configurations with different settings in each, how do you determine the correct SoT settings? Which attributes are device level vs group level? Which templates apply to which devices? There is also the challenge that not all configuration elements are easy to represent in the SoT. Access control lists, firewall rules, and route maps are particularly challenging.

![](/assets/images/Screen-Shot-2021-11-18-at-8.20.44-PM.png){:width="600px"}

**The difficulty of building the right SoT and templates means that it can take a long while to see the RoI (return on investment). Your organization may lose focus and give up along the way.**

Is there a better approach to network automation—one that provides immediate returns and incremental value with incremental effort? Fortunately, the answer is yes. It is a change-focused approach that directly automates network changes, without requiring a detailed SoT that can generate full configs.

Suppose you want to automate firewall changes that open access to new services. The inputs to the change are IP addresses, protocols, and ports of the service. As part of executing this change, you need to validate that the requested access is not already there (pre-check), generate the rulebase update to permit access, and validate that the update has the intended impact (post-check). If you can generate and validate this change directly, you do not need to be able to generate the firewall configuration from scratch.

Thus, the change-focused approach to network automation works as follows:

1. Select the type of change you want to automate—favor common or risky ones.
2. Develop scripts to generate the configuration change
3. Develop scripts to deploy configuration and run pre- and post-checks.

**This approach will provide RoI as soon as you have automated the first change. After automating the top ten changes, you would likely experience almost all of the benefits of network change automation.**

![](/assets/images/Screen-Shot-2021-11-18-at-8.21.09-PM.png){:width="600px"}

To successfully execute the change-focused approach, your change MOPs (method of procedure) are a good place to start. As they are based on your network structure and business logic, they already have the information you need, including the configuration commands and pre- and post-checks. The right tools can help you effectively automate what the MOP is doing. For change generation, you may use jina templates rendered using request parameters or use Ansible resource modules.

For change validation, you need assurance about end-to-end network behavior. When network configs are not generated from scratch, you cannot just assume that devices are configured in a certain way; snowflakes and gaps in your assumptions can cause the change to not have its intended impact, or worse, cause collateral damage.  Ideally, you would validate the impact of the change before deploying the change to production. Simulation tools like Batfish or emulation tools like GNS3 enable such validation. See [our blog that discusses differences between these methods](/2021/03/31/network-test-automation-rock-paper-scissors-lizard-or-fish.html).

For examples of change-focused automation using Batfish Enterprise, see these blogs: [Firewall rule changes](/2021/05/18/automating-the-long-pole-of-network-changes.html), [Provisioning a new subnet](/2021/04/30/test-drive-network-change-mops-without-a-lab.html).

Change-focused automation is not incompatible with SoTs and can be augmented with whatever SoT you have. Even if you have partial SoT, with data that is not detailed enough to generate full device configs, you can use it to generate some types of changes and to generate automatic tests (e.g., no firewall change should open access to sensitive services defined in the SoT).  However, unlike the SoT-first approach, change-focused automation is not gated on the availability of a fully-fleshed-out SoT. It can leverage even a minimal SoT and allows you to incrementally improve the SoT. It is this incremental nature that makes change-focused automation an attractive, practical approach to network automation.
