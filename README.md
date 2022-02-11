# e-commerce drafts

A bunch of architectural drafts of a hypotetical e-commerce admin panel using different approaches and/or frameworks.

## Overview

After spending around five years building e-commerce application web frontends I felt I wanted to crystalize my learnings on how they should be built, before switching to new fields.

I plan to build half a dozen drafts using different frameworks both to demonstrate that essential architectural parts are framework agnostic and to ease proposed solution discussions (if I will ever have any) with people comfortable with different stacks.

## Scope

Each draft is a front-end part of a simplistic product catalog management application (i.e. section of an online shop admin panel, which lets shop owners/admins edit products and organize them into categories).

The backend part is out of the scope of these drafts and will be mocked.

## Key architectural properties

The properties I want to achieve in these draft using the architecture I plan to use:
 - ease of replacing view/networking/routing/etc. third-party libs/frameworks
 - uncomplicated testability. It should be possible to cover as much logic with just unit tests as possible. Unit tests, in turn, should use as little amount of mocking as possible.

## List of drafts

1. [redux](./redux)
