---
title: "Plug the hole in your network automation — validate changes before you deploy"
date: "2018-08-21"
author: Samir Parikh
tags:
  - "batfish"
  - "networkautomation"
  - "networkvalidation"
  - "predeployment"
  - "pybatfish"
  - "validation"
---

We are excited to announce the release of [pybatfish](https://github.com/batfish/pybatfish), an open-source Python SDK for Batfish. Batfish is an open-source, multi-vendor network validation framework that enables network engineers, architects and operators to proactively test and validate network design and configuration. It is being used in some of the world’s largest networks to prevent deployment of incorrect configurations that can lead to outages or security breaches.

![](/assets/images/promo-batfish.png)

Historically, network engineers have had to rely on manual lab testing and peer reviews to validate new designs or changes to the network. In recent years, virtual instances of popular network elements and orchestration tools like Vagrant have made a thin layer of automatic testing possible. Such emulation environments can be invaluable. They help users understand the vendor configuration syntax, build base configuration templates, and test new features.

Unfortunately, the emulation-based approach is severely limited. It fails to replicate the scale of the production environment, and the configurations tested on these virtual environments cannot be pushed to production as is (e.g., because interface names don’t match).

Thus, if you want to be sure that the change you are about to push to the network won’t result in an outage or a security breach, you need a full-scale analysis of the production environment. This has not been possible. Until now.

With Batfish, you get comprehensive correctness guarantees for network configuration even in heterogeneous, multi-vendor environments. Batfish simulates the network behavior and builds a model just from device configurations (and, optionally, other data such as routing announcements from peers). With this, Batfish predicts how the network will forward packets and how it will react to failures.

**Proactive correctness guarantees are the missing piece of today’s automation workflows. Validation with Batfish fixes that.**

This capability of building the model from the configuration itself is very important. It enables Batfish to evaluate network changes and guarantee correctness proactively, without requiring configuration changes to be first pushed to the network. Solutions that model network behavior by extracting the RIBs and FIBs from the network cannot provide proactive guarantees about the correctness of the network.

Batfish allows you to query the model for a broad range of information, which can be used to build your validation test suite. Network compliance and auditing tasks like extracting and validating NTP server, DNS server, TACACS server, interface MTU, etc. are trivial even for a multi-vendor network.

Furthermore, complex validation tasks that rely on packet forwarding behavior (which depends on the RIBs and FIBs) become effortless with Batfish:

- Find all possible paths between the application and database servers for your e-commerce site.
- Validate that a firewall or ACL change needed to deploy a new application to production won’t a) take down existing services and b) create a security hole.
- Guarantee that the routing policy change you are about to make won’t blackhole some of your traffic (or worse [take down the internet](2017/11/27/dont-accidentally-break-internet-like-level-three.html)).

At Intentionet, we are committed to helping you build reliable and secure networks, faster. And our commitment to open-source is just as strong as when we started our research six years ago.

**The impossible is now possible: you can build reliable and secure networks faster.**

Today’s release of [pybatfish](https://www.github.com/batfish/pybatfish) furthers that commitment. Pybatfish simplifies the use of Batfish and enables seamless integration into any network automation workflow.

Check out the [Jupyter notebooks](https://github.com/batfish/pybatfish/tree/master/jupyter_notebooks) and [videos](https://youtu.be/Ca7kPAtfFqo), to see examples detailing how easy it is to start proactively validating your network. To learn more, join the [Batfish community on Slack.](https://join.slack.com/t/batfish-org/shared_invite/enQtMzA0Nzg2OTAzNzQ1LTUxOTJlY2YyNTVlNGQ3MTJkOTIwZTU2YjY3YzRjZWFiYzE4ODE5ODZiNjA4NGI5NTJhZmU2ZTllOTMwZDhjMzA)

