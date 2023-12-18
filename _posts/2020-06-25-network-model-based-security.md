---
title: "Network-model-based security: A new approach that blends the advantages of other leading methods"
date: "2020-06-25"
author: Ratul Mahajan
---

Effective network security is largely based on a central challenge: making sure that only authorized communication among security principals (users, systems, or groups) is allowed. But meeting this challenge has gotten harder as security methods grow more granular and complex.

<!-- ![](/assets/images/cyber-security-3400657_1920.jpg) -->

As organizations deploy microsegmentation and move from coarser methods like subnet-level security to finer-grained controls at the individual host and service levels, they face a connectivity matrix with many more principals to account for. In this new world, the task of ensuring only authorized pairs of principals can communicate is far too complex to be done manually. Having the right tools is important. So how do you know which tool to choose?

To think about this, let's review the most traditional current methods. Broadly speaking, network security analysis tools take one of two approaches: **probing** or **packet filter analysis**. The first approach sends test probes into the network to help uncover which ports are accessible, on which servers, and from which vantage points, such as the Internet. _Nmap_ is a popular penetration testing tool that uses probes.

The second approach analyzes packet filters in the network such as ACLs, firewall rules, and security groups in public clouds. Instead of sending packets into the network, the tool inspects the packet filters to determine what is and is not permitted: is Telnet blocked, is SSH allowed, and so on. This approach is used in firewall vendor products as well as those that analyze public cloud security groups.

Each approach has its plusses and minuses. Probing-based tools measure end-to-end behavior, accounting for the full impact of network paths and filters hit by packets from the source to destination. But their analysis is inherently incomplete because they can't generate packets whose headers track to all possible combinations of addresses, protocols, and ports. As a result, these tools can fail to identify vulnerabilities that exist in the network.

Probing-based tools also impose a high setup tax. You have to setup a few probe sources, which need to be whitelisted to ensure that probe traffic is not blocked by intrusion-detection systems. Given these requirements, it's not feasible to run probing-based tools from a large set of sources, and even less feasible to run them every time you change the network—which means more vulnerabilities are likely to get missed.

Packet filter analysis tools, on the other hand, require minimal infrastructure setup and can be complete with respect to an individual filter. However, these tools don't analyze end-to-end security, which is a function of network paths and the combined impact of multiple packet filters that appear along those paths. So these tools can also miss vulnerabilities, or falsely report vulnerabilities when they get paths wrong.

### End-to-end analysis without gaps, guaranteed

Given these choices, each with its own risks, what is a network security engineer to do? Wouldn't it be great to have the best of both worlds? Good news: a new approach makes this combination possible, while giving you proactive capabilities and avoiding the pitfalls of the previous methods. Batfish uses this network-model-based approach, as do Amazon Inspector and Google Network Intelligence Center.

Network-model-based tools analyze network-wide configuration and state to infer the (possibly multiple) paths taken by any flow, along with the packet filters encountered along those paths. The tool then does a complete analysis of which flows are carried or blocked by the network, covering all possible sources, destinations, and packet headers. This level of analysis would be generally be prohibitive, but here it's enabled by data structures and algorithms originally invented for hardware verification and adapted for networks. The result is end-to-end analysis that is mathematically precise, without any missed vulnerabilities or false reports.

On top of providing end-to-end and comprehensive analysis, network-model-based tools are easy to set up and can be run continuously in your environment.

### The best part: Know before you change

Another key innovation of the network-model-based approach is that it can evaluate security posture before the network is changed. This ability helps you switch from reactive to proactive security analysis, because the tool alerts you to vulnerabilities before the network is impacted. Previously, only packet filter analysis tools could be proactive, but their ability to do so only applied to packet filter changes, not the other changes on your network.

The table below summarizes the capabilities of the three approaches mentioned here.

<table width="492" border=1><tbody><tr><td width="124"></td><td style="text-align: center;" width="92">Probing</td><td style="text-align: center;" width="126">Packet filter analysis</td><td style="text-align: center;" width="150">Network model based</td></tr><tr><td style="text-align: right;" width="124">End-to-end analysis</td><td style="text-align: center;" width="92">✅</td><td width="126"></td><td style="text-align: center;" width="150">✅</td></tr><tr><td style="text-align: right;" width="124">Analyze all possible packets</td><td width="92"></td><td style="text-align: center;" width="126">✅</td><td style="text-align: center;" width="150">✅</td></tr><tr><td style="text-align: right;" width="124">Easy setup, continuous operation</td><td width="92"></td><td style="text-align: center;" width="126">✅</td><td style="text-align: center;" width="150">✅</td></tr><tr><td style="text-align: right;" width="124">Proactive security</td><td width="92"></td><td style="text-align: center;" width="126">(only filter changes)</td><td style="text-align: center;" width="150">✅</td></tr></tbody></table>

 

### Picking the right tool

So, suppose you are keen on using a network-model-based tool to secure your network. Which one should you choose? We'll cover the various tools more deeply in a future blog, but for now, here are two key considerations: ● Does the tool provide proactive security? ● Can the tool cover your entire network, which might span multiple public and private clouds?

When you weigh your options based on these criteria, you'll see that not all tools are created equal. Batfish enables proactive security and can analyze all types of networks, including public cloud. To read more about Batfish in action, and how it provides proactive security guarantees, check out [this article](https://tech.ebayinc.com/engineering/safe-acl-change-through-model-based-analysis/) describing how eBay network engineers _**used Batfish to shrink their border ACLs by 80% without any service impact**_.

### Summary

The last few years have seen the emergence of a new approach to network security that combines the best features of probing and packet filter analysis. Using a network-model-based security tool gives you continuous, end-to-end security analysis that covers your whole network and considers all possible packets. And with the right tool, you can achieve all of these benefits proactively and identify vulnerabilities before your network changes are even applied.
