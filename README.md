# OpenFGA_Demo
### Autorzy: Mateusz Asimowicz, Jakub Cichocki, Jan Prokop, Aleksander Pytel 
##### Termin: sem. zimowy 2024, piątek 16:45 <a nie 17:00 ? xd>  grupa <różne, nie wiem co wpisać>

---

## 1. Introduction
OpenFGA is an open-source relationship-based access control solution. We can specify relations between users/groups of users/objects and decide whether to grant or deny access to given resources, using APIs included for multiple programming languages.

## 2. Theoretical background/technology stack
OpenFGA is used to centralize authorization decisions and make the systems easier to audit, change and write, by decoupling it from the core service code - making the language-specific quirks of given authorization implementation irrelevant, since we operate that on the outside of the “work” server domain. 
Upkeep of a single authorization point in the system architecture also makes it easier to pinpoint any potential issues, and OpenFGA structure can be familiar to developers working on other projects later, as core concepts behind it can be reused.
It also provides a system for an easy implementation (and possible changes) for a Relationship-Based Access Control (ReBAC) model, alike to the one that Google Zanzibar is known to use - existing relation between user (group) through action on a given resource means that the user is authorized to undertake given action, for example this link existing:
owner - can_read - doc
authorizes the owner to read the doc resource.

For the technology stack - we will deploy OpenFGA and a few servers, using an OpenFGA implementation in given language - possibly Go, Python, JS, as well as an “actor” that will try to either request a resource, request a high amount of resources, or try to access resources despite the lack of access granted to them, in a technology that is yet to be determined. 

We will try to containerize given elements of the test system using Docker, as well as utilizing Kubernetes to manage the running components of the test system.

## 3. Case study concept description

Main target of the study will be to assess how OpenFGA works under pressure and what is the overhead related to asking about the permission state when making API requests, mainly taking into consideration the response time on the server and to the client requesting the resource.

To this goal we will make measurements of the requests made/handled in a given timeframe, possibly the amount of time for a single request if it’s possible to discern, considering that it might be not enough time to be effectively measured.

We will use Docker and/or Kubernetes to make components of the study system platform and architecture agnostic, making the underlying operating system not a factor when considering running the test suite due to containerization.

The core components of the systems will be:
- OpenFGA deployment
- server(s) that utilize OpenFGA API calls to determine authorization status
- an actor that requests a resource (valid), in a specified amount
- an actor that requests a resource (invalid), be it a non-existing one, or without necessary permissions, in a specified amount
- (optional) a logging component that will make it easier to collect results from after running the test suite
- (optional) test suite orchestrator sending a “start” message to systems being a part of the given use case test
