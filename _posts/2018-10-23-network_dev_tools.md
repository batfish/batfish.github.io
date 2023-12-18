---
title: "Network Engineers: Time to Restock your Tool Chest"
date: "2018-10-23"
author: Dan Halperin
tags:
  - "batfish"
  - "networkautomation"
  - "networkvalidation"
  - "predeployment"
  - "validation"
---

At Future: Net 2017, our CEO Ratul Mahajan introduced a new network engineering workflow. Designed to evaluate the operation of ever more complex and scaled networks, this workflow aims to eliminate misconfigurations that can lead to a downward spiral of outages, security breaches, and other failures; and to make networks less of a long pole in application delivery.

![](/assets/images/female_construction_worker_on_her_way_to_work_at_a_server_room.png){:width="600px"}

As we discussed in previous articles, there are three pillars of this new networking engineering workflow: 1) formal validation of network configurations, 2) intent specification languages to bridge the gap between the intended high-level policies of a network and its low-level configuration, and 3) development tools.

We discussed [formal validation](/2017/09/12/new-network-engineering-workflow-formal-validation.html) and [intent specification languages](/2018/01/29/intent-specification-languages-simplifying-network-configuration.html) in previous blogs. We will discuss development tools in this blog.

When you compare software and network engineering trends at a high level, the contrast is striking. Application development has become remarkably agile, robust and responsive, while the networks that carry those apps have not. They continue to be slow to evolve and prone to error. A critical reason for the difference is tools.

From integrated development environments (IDEs) with valuable plugins for static analysis, dead code detection, and linting to unit test frameworks that enable continuous testing to automated build and deployment tools, the discipline of software engineering has evolved rapidly and for the better.

Network engineers, on the other hand, have not been so lucky. There is not even an IDE for network configurations; we just have simple editors like Vi (or Vim) and Emacs. (See Table 1.)

**Table 1 – A Tale of Two Tool Chests**

<table border=1 width=600><tbody><tr><td style="text-align: center;"><strong>Software Engineering Dev Tools</strong></td><td style="text-align: center;"><strong>Network Engineering Dev Tools</strong></td></tr><tr><td style="padding: 2em;"><p style="margin-bottom: 0;"><strong>IDE</strong></p><ul><li>IntelliJ</li><li>Eclipse</li><li>Pycharm</li></ul><p style="margin-bottom: 0;"><strong>Continuous build and test</strong></p><ul><li>Travis</li><li>Jenkins</li></ul><p style="margin-bottom: 0;"><strong>Unit Test</strong></p><ul><li>JUnit</li><li>Pytest</li></ul><p style="margin-bottom: 0;"><strong>Static Analysis</strong></p><ul><li>Pylint</li><li>Findbugs</li><li>Checkstyle</li><li>PMD</li></ul><p style="margin-bottom: 0;"><strong>Fuzz Testers</strong></p><ul><li>JFuzz</li></ul></td><td style="padding: 2em;"><p style="margin-bottom: 0;"><strong>Editors</strong></p><ul><li>Vi</li><li>emacs</li><li>Sublime</li><li>Atom</li></ul></td></tr></tbody></table>

 

Given the fact that each vendor has its own configuration language (or in some cases, multiple configuration languages), the possibility of a true IDE emerging is slim at best. But the lack of a true IDE is just one of the challenges facing network engineers.

Network validation frameworks are the critical gap. Developed jointly by researchers here at Intentionet, UCLA, USC and Microsoft Research, [Batfish](https://www.batfish.org/) is designed to plug that gap with a tool that detects bugs in network configurations.

As discussed in a prior [blog post](/2018/08/21/plug-hole-in-your-network-automation.html), Batfish simulates the network behavior and builds a model from device configurations, predicting how the network will forward packets and how it will react to failures. This capability of building the model from just device configurations enables Batfish to evaluate network changes and guarantee correctness proactively, without requiring configuration changes to be first pushed to the network.

Leveraging the Python SDK, [Pybatfish](https://www.github.com/batfish/pybatfish), we can now build a suite of development tools for network engineers that can be leveraged to create an automated test environment. Here are four categories of such tools:

**Linting and dead-code detection**. With Pybatfish, a network engineer can identify undefined references or unused declarations, such as route-maps, ACLs, prefix-lists, and community-lists, or find a non-standard NTP server or identify unreachable lines in an ACL.

**Unit testing**. Each network has a list of constant configuration elements that are expected to always be true: All interfaces must have MTU of 4096; all devices in a given data center must have a defined set of NTP, DNS, TACACS servers; all interfaces must have LLDP enabled. These can easily be converted into automated unit tests with Pybatfish, such that only changes that pass all of these tests can be pushed to the network. Just like we do today for software changes.

**Continuous integration (CI)**. Validating key device configuration attributes is useful, but validating overall network behavior is even more important. You can now write tests to ensure that a DNS server is globally reachable, or no single-interface failure leads to a loss of connectivity for a critical application, etc. You can now define the critical network behaviors that must always hold true as CI tests and embed these into an automated test environment.

**Change analysis**. Starting with a known working configuration, you can add the planned configuration to see the configuration and behavior variance. You can see, for instance, if flow A is blocked in the planned but not in the reference config, or that flow B takes another path, or if new flows appear that were not intended. This exploration allows you to analyze a proposed change in real-time, using the results to build your unit test and integration test suite.

Software engineers have leveraged a suite of tools to rapidly respond to changing business needs, accelerate development and improve reliability. The network is now increasingly becoming the bottleneck in application deployment and the digital transformation of business. It is time for network engineers to respond. The foundational elements for the new network engineering workflow are here.
