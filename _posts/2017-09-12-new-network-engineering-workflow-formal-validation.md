---
title: "The New Network Engineering Workflow – Formal Validation"
author: Samir Parikh
date: "2017-09-12"
tags:
  - "batfish"
  - "networkautomation"
  - "networkvalidation"
  - "predeployment"
  - "validation"
  - "verification"
---

At Future:NET 2017, hosted by VMWare in Las Vegas on August 30th and 31st, our CEO Ratul Mahajan gave the [keynote presentation](https://youtu.be/LfoCK7Au6to). Ratul spoke at length about how we can help network engineers and operators make their networks highly agile, reliable, and secure by adapting proven approaches employed by hardware and software engineers.

![](/assets/images/ratul_keynote_2017.jpg){:width="400px"}

Ratul observed that designing and operating a network is an extremely complicated task. Modern enterprise, cloud and telecommunications networks are extremely large, with hundreds to thousands of devices and have complicated policies for reachability, security and performance. And while the devices and applications that form these networks have become increasingly sophisticated, the tools and processes network engineers and operators have to design, build and maintain them have not even come close to keeping pace.

The best we have done is a set of increasingly sophisticated monitoring and visualization tools, which while valuable are woefully insufficient—-they only tell you something has gone wrong, only after something has gone wrong, and even then they provide little help in figuring out the root cause or how to fix things.

In contrast, hardware and software engineers have available to them a rich array of technologies and tools that help them do their jobs safely, correctly, and rapidly. These include capabilities like design rule checking, functional verification, power analysis, unit-testing, continuous integration, change management, etc.

In his keynote, Ratul introduced the concept of the new network engineering workflow inspired by capabilities used by hardware and software engineers.

<div class="img-background">
    <img src="/assets/images/network_engineering_workflow3.png" width="800px">
</div>


This workflow includes **Formal Validation, High-level Intent Specification, and Development Tools.**

### In this post, I will explore the emerging space of Formal Validation for networks.

Formal validation (or verification, as some are wont to call it) has been leveraged successfully in hardware and software engineering to provide correctness guarantees for critical functions. In our present day, it is hard to find a more critical function than the network that powers the applications and services that we cannot live without—Gmail, Google Maps, Spotify, Apple Music, Amazon.com, etc.

For networks to be robust and give engineers peace of mind, what we need is proactive guarantees of operation, with the ability to predict what may go wrong, why it would go wrong and how to avoid that from happening.

This is where formal validation comes into play. So what is formal validation/verification?

> **[Formal verification](http://archive.eetasia.com/www.eetasia.com/STATIC/PDF/201005/EEOL_2010MAY21_EDA_TA_01.pdf?SOURCES=DOWNLOAD "Open Link")** is the act of proving or disproving the correctness of algorithms underlying a system with respect to a certain formal specification or property, using formal methods of mathematics

So what does that mean in the context of networks? It means providing comprehensive guarantees for properties such as reachability, security, and performance. Comprehensive means that the guarantees must hold for not just one or two scenarios but all scenarios (e.g., all possible packets, all possible failure. etc.) With formal validation, network engineers can provide such guarantee on various aspects of network behavior.

For example, formal validation tools can answer some or all of the following questions about network behavior:

1. Is the DNS server globally reachable?
2. Are two subnets isolated with respect to all traffic?
3. Do spine routers treat all destinations identically?
4. Can any unencrypted packet go between two branch offices?
5. Will any interface failure lead to connectivity loss?
6. Can any external announcement disrupt internal connectivity?
7. Is all communication with the device secure?

By leveraging formal validation, network engineers can be assured that any new network design, any routing or security policy change, any failure will not hurt the critical services that the network supports. No longer will network engineers and operators need to worry about rolling out a change that may cause an outage for a critical service because they can guarantee that this will not happen in advance.

Over the last several years there has been a number of academic research initiatives to bring formal validation into the realm of networking. Broadly speaking there are two categories of formal validation techniques: 1) **Control-plane validation,** and 2) **Data-plane validation.**

Data-plane validation techniques, such as [Header Space Analysis (HSA)](https://www.usenix.org/system/files/conference/nsdi12/nsdi12-final8.pdf "Open Link"), [VeriFlow](https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final100.pdf "Open Link"), and [Network-optimized Datalog (NoD)](https://www.usenix.org/node/189019 "Open Link") read the **_current_** forwarding behavior of the network (FIBs, ACLs, firewall rules) and model that to provide correctness guarantees on the **_current_** behavior of the network with respect to all possible packets.

<div class="img-background">
    <img src="/assets/images/network_engineering_workflow_dataplane_validation2-1.png" width="800px" alt="network engineering workflow dataplane validation diagram">
</div>

Control-plane validation techniques, such as [Batfish](https://www.usenix.org/system/files/conference/nsdi15/nsdi15-paper-fogel.pdf "Open Link") and [Minesweeper](https://ratul.org/papers/sigcomm2017-minesweeper.pdf "Open Link"), start with modeling the network control plane. They understand the operation of devices and the protocols that drive their dynamic state such as OSPF, ISIS, BGP, ACLs, firewall rules, etc. Control-plane validation tools, such as Batfish, understand and model the network control plane and compute the reachability (RIBs) and forwarding behavior (FIBs, ACLs, FW) and combine that information to provide correctness guarantees for **_all possible_** states of the network.

<div class="img-background">
    <img src="/assets/images/network_engineering_workflow_controlplane_validation2.png" width="800px" alt="network_engineering_workflow_controlplane validation">
</div>

![]()

The difference in techniques manifests itself in the types of guarantees the system can provide. With control-plane validation, the answers to all 7 of the questions listed above can be guaranteed and they can be guaranteed for the current and any future possible state of the network. Whereas with data-plane validation, answers to the first 4 can be guaranteed for only the current state of the network.

The difference between control-plane and data-plane validation also manifests in whether they can provide proactive guarantees before the configuration is pushed to the network. **Control-plane validation, because it reasons about the configuration itself, can be used for proactive protection.** Data-plane validation cannot be used in that way since it reasons about the current state of the network.

Formal network validation is not science fiction anymore and its effectiveness has been proven on many real, large networks. Those who want to experience it themselves, and aren’t afraid of getting their hands dirty, should go to [www.batfish.org](http://www.batfish.org/), which links to an open source project with combined capabilities of NoD, Batfish, and Minesweeper, for control as well as data plane validation. (Intentionet builds its validation solution on top of this open-source project.)

With the ability to comprehensively guarantee critical aspects of network behavior, network engineers and operators can rapidly innovate, explore new technologies and designs, and respond to the changing business needs of their companies.

This is a truly exciting time to be involved in networking. In future blog posts, we will explore the state of **High-level Intent Specification and Development Tools.**
