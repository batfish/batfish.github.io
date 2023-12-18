---
title: "Network as code: From hype to substance"
date: "2020-02-20"
author: Ratul Mahajan
tags:
  - "batfish"
  - "networkautomation"
  - "networkvalidation"
  - "predeployment"
  - "validation"
---

Last week, Arista and Cumulus hosted webinars on building CI/CD pipelines for the network (see [Arista Webinar](https://www.ansible.com/resources/webinars-training/ansible-network-automation-with-arista-cloudvision-and-arista), [Cumulus Webinar](https://cumulusnetworks.com/learn/resources/webinars/webinar-network-validation-with-dinesh-dutt)). Both webinars communicated a vision that included generating configuration (changes) automatically, pre-deployment validation, and automated deployment,  followed by post-deployment validation.

I found these webinars exciting for two reasons. The first was the emphasis they placed on validation, and in particular, on pre-deployment validation. Validation is often overlooked when talking about network automation. But given that a bad configuration change can bring down the whole network, pre-deployment validation is essential to reducing the risk that stems from automated changes. It was great to see the presenters of both webinars acknowledge this risk and advocate robust automation pipelines.

![](/assets/images/Screen-Shot-2020-02-16-at-2.41.00-PM-300x170.png){:width="600px"}
[Cumulus Webinar: Automating the Validation Workflow](https://cumulusnetworks.com/learn/resources/webinars/webinar-network-validation-with-dinesh-dutt)
 

![](/assets/images/Screen-Shot-2020-02-16-at-2.41.33-PM-300x152.png){:width="600px"}
[Arista Webinar: Ansible AVD Overview and Demo](https://www.ansible.com/resources/webinars-training/ansible-network-automation-with-arista-cloudvision-and-arista)
 

Incidentally, both webinars recommended Batfish for pre-deployment validation. It tickles me to see how far Batfish has come. I can trace its roots to 2012, when I was at Microsoft Research. At Microsoft, I was fortunate to observe and contribute to the rapid scaling of Azure and other networks. That experience crystallized my belief that networking needed to change radically. The applications were evolving and migrating rapidly thanks to virtualization (VMs and Containers) and modern CI/CD tools. The network was the least nimble — and the least reliable — component of the technology stack. To keep pace with the applications, the network needed to be like software.

I started tackling an important part of this multifaceted challenge along with researchers at UCLA and USC. We knew from prior studies that configuration errors are the dominant cause of network outages and breaches. So, our thought was: if we could validate configuration changes _before_ they are pushed to the network, configuration errors would never reach the network. And if all network changes could be rigorously and automatically validated, engineers would have the confidence to evolve the network rapidly to meet application needs.

In 2014, we had the kernel of a promising tool. We called it Batfish and open sourced it. Almost exactly three years ago, in 2017, I left Microsoft for Intentionet with the mission to enable network engineers to “design and evolve the network like software.” Batfish and a commitment to open source would go on to become the core of Intentionet.  Batfish becoming an essential element of the network CI/CD pipelines is an attestation to both its original premise and it being multi-vendor and open-source.

The second exciting aspect of the webinars was how much they had in common despite coming from different vendors. It suggests that the networking community has gone beyond the hype of three years ago and is converging on a shared methodology and concrete workflows. If you don’t remember 2017, “fidget spinner” was a top-10 search term on Google, and intent-based networking was being billed as the next big thing in networking. Cisco unleashed a marketing campaign around it, VMWare dedicated its Future:NET event to it, and Juniper was touting a similar concept under the guise of “self-driving networks.” Gartner and other analysts were rushing to define intent-based networking and assessing different companies’ vision against their definition.

Three years on, we have gone beyond the hype, and underlying substance is emerging. A recent [NetDevOps survey](https://dgarros.github.io/netdevops-survey/reports/2019) shows that, over the last three years, the fraction of network engineers who have implemented CI pipelines has nearly doubled, from 18% to 35%. Equipment vendors too have gone beyond marketing. Devices have vastly improved APIs that help streamline network CI/CD pipelines. Equally importantly, as the webinars illustrate, they are also educating network engineers about modern software development practices. Cisco’s DevNet program, along with revamped certifications, and Juniper’s NRELabs are also notable in this direction.

All this is not to say that the network has become code. After all, two-thirds of network engineers are still not using CI pipelines. But that should not cloud the progress over the last few years, and I am optimistic that we can drive that number down to zero in the next few years. Building mission-critical networks without automation and rigorous validation will soon be unthinkable, just as building mission-critical software without rigorous CI/CD pipelines is unthinkable today.
