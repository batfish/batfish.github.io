---
title: "Announcing Ansible modules for Batfish"
date: "2019-06-14"
author: Samir Parikh
tags:
  - "ansible"
  - "batfish"
  - "networkautomation"
  - "networkvalidation"
  - "predeployment"
  - "validation"
---

We are excited to announce Ansible modules for Batfish. Now, network engineers can invoke the power of Batfish within Ansible-based automation workflows.

<!-- ![](/assets/images/Batfish_ansible-300x127.png) -->

Network automation is like a car with a powerful engine— it may get you places quickly, but does not guarantee that you’ll get there _safely_. Safe driving requires advanced collision prevention systems. Similarly, safe network automation requires pre-deployment validation which can ensure that network changes have the intended impact, do not cause an outage, and do not open a security hole, _before_ the change is pushed to the network.

Batfish is a powerful pre-deployment validation framework. It can guarantee security, reliability, and compliance of the network by analyzing the configuration (changes) of network devices. It builds a detailed model of network behavior from device configurations and finds violations of network policies (built-in, user-defined, and best-practices).

Before today, using Batfish required writing Python code. **Today’s release enables engineers to add validation to their Ansible playbooks without writing any Python code.**

Let’s walk through a few example use cases to get a taste of how it can be done.

## Use case I: Fact extraction

To extract “facts” (config settings) from configuration files, one can simply do the following.

```
 - name: Setup connection to Batfish service
   bf_session:
    host: localhost
    name: local\_batfish

 - name: Initialize the example network
  bf_init_snapshot:
    network: example_network
    snapshot: example_snapshot
    snapshot_data: ../networks/example
    overwrite: true

 - name: Retrieve Batfish Facts
   bf_extract_facts:
     output_directory: data/bf_facts
   register: bf_facts
```

The first task above establishes a connection to the Batfish server. The second command initializes the snapshot from provided data. The third command extracts facts from the snapshot and writes them to a directory. For each device Batfish will generate a file in the specified output directory.

The complete output can be found [here](https://github.com/batfish/ansible/tree/master/tutorials/playbooks/data/bf_facts). This snippet below highlights key facts that Batfish extracts from device configuration files:

```
 nodes:
 as1border1:                           ⇐ Device name
  BGP:                                 ⇐ BGP Process configuration attributes
    Router_ID: 1.1.1.1
    Neighbors:                         ⇐ BGP Neighbor configuration attributes
      10.12.11.2:
      Export_Policy:
      - as1_to_as2
      Local_AS: 1
      Local_IP: 10.12.11.1
      Peer_Group: as2
      Remote_AS: '2'
      Remote_IP: 10.12.11.2
      …
  Community_Lists:                     ⇐ Defined Community-lists
  - as1_community
  Configuration_Format: CISCO_IOS      ⇐ Device Vendor & OS Type
  DNS: ...                             ⇐ DNS configuration attributes
  IP6_Access_Lists: []                 ⇐ Defined IPv6 access-lists
  IP_Access_Lists:                     ⇐ Defined IPv4 access-lists
  - '101'
  Interfaces:                          ⇐ Interface configuration attributes
    GigabitEthernet0/0:
      Access_VLAN: null
      Active: true
      All_Prefixes:
      - 1.0.1.1/24
      Allowed_VLANs: ''
      Description: null
      Incoming_Filter_Name: null
      MTU: 1500
      Native_VLAN: null
      OSPF_Area_Name: 1
      OSPF_Cost: 1
      ...
      Primary_Address: 1.0.1.1/24
      VRF: default
      VRRP_Groups: []
  NTP ...                              ⇐ NTP configuration attributes
  Route6_Filter_Lists: []              ⇐ Defined IPv6 prefix-list/route-filters
  Route_Filter_Lists:                  ⇐ Defined IPv4 prefix-list/route-filters
  - '101'
  Routing_Policies:                    ⇐ Defined routing policies/route-maps
  - as1_to_as2
  SNMP ...                            ⇐ SNMP configuration attributes
  Syslog ...                           ⇐ Syslog configuration attributes
  VRFs:                                ⇐ Defined VRFs
  - default
 version: batfish_v0                     ⇐ Batfish Fact model version
```

The functionality above uses the full-config (e.g., the output of “show run”) parsing capabilities of Batfish. While there are other tools available for parsing configs, Batfish is unique in being vendor neutral (unlike Cisco’s Parse Genie) and being able to parse full configurations instead of specific show commands.

Those advantages aside, the real power of Batfish is in being able to _validate_ configs, with respect to both config settings and the resulting network behavior. We talk about these next.

## Use case II: Fact validation

Validating that facts in device configs match what is expected is easy with the  **_bf\_validate\_facts_** module.

```
- name: Validate facts gathered by Batfish
  bf_validate_facts:
    expected_facts: data/validation
  register: bf_validate
```

The task above will read facts from the specified folder and check that they match those in the initialized snapshot (done in a prior task). You can validate a subset of the attributes or all of them. The task will fail if any of the facts on any of the nodes does not match.

## Use case III: Behavior validation

Beyond parsing configs, Batfish builds a full model of device configurations and resulting network behavior. This model can be validated in a range of ways, as follows:

```
 - name: Validate different aspects of network configuration and behavior
   bf_assert:
     assertions:
       - type: assert_reachable
          name: Confirm web server is reachable for HTTPS traffic received on Gig0/0 on as1border1
          parameters:
            startLocation: '@enter(as1border1[GigabitEthernet0/0])'
            headers:
              dstIps: '2.128.0.101'
              ipProtocols: 'tcp'
              dstPorts: '443'

        - type: assert_filter_denies
          name: Confirm that the filter 101 on as2border2 drops SSH traffic
          parameters:
            filter_name: 'as2border2["101"]'
            headers:
            applications: 'ssh'

        - type: assert_no_incompatible_bgp_sessions
          name: Confirm that all BGP peers are properly configured

        - type: assert_no_undefined_references
          name: Confirm that there are NO undefined references on any network device
```

The task above includes four example assertions from our assertion library. The _**bf\_assert**_ module includes more, and based on community feedback, we’ll continue to make more of Batfish’s capabilities available this manner.

Today’s release makes network validating broadly accessible, furthering our commitment to helping network engineers build secure and reliable networks.

To help you get started with Batfish and Ansible, we have created a series of tutorials which can be found in this [GitHub repository](https://github.com/batfish/ansible/tree/master/tutorials).

For feedback and feature requests, reach us via [Slack](https://join.slack.com/t/batfish-org/shared_invite/enQtMzA0Nzg2OTAzNzQ1LTUxOTJlY2YyNTVlNGQ3MTJkOTIwZTU2YjY3YzRjZWFiYzE4ODE5ODZiNjA4NGI5NTJhZmU2ZTllOTMwZDhjMzA) or [GitHub](https://github.com/batfish/batfish).
