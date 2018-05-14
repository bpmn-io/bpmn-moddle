# Changelog

All notable changes to [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 5.1.5

* `FIX`: correct `StandardLoopCharacteristics#loopMaximum` type [#56](https://github.com/bpmn-io/bpmn-moddle/issues/56)

## 5.1.4

* `FIX`: correct extension attributes not being serialized on `bpmn:Expression` elements ([#55](https://github.com/bpmn-io/bpmn-moddle/issues/55))

## 5.1.3

* `FIX`: correct missing `resourceParameterBinding` parent

## 5.1.2

* `CHORE`: warn on unknown attribute in well-known namespace
* `FIX`: correct missing `participantMultiplicity` parent

## 5.1.0

* `CHORE`: bump dependency versions

## 5.0.0

### Breaking Changes

* `FEAT`: migrate to ES modules. Use `esm` or a ES module aware transpiler to consume this library.

## 4.0.0

* `FEAT`: encode entities in body properties (rather than using CDATA escaping)

## 3.0.2

* `FIX`: properly handle `.` in attribute names

## 3.0.1

* `FIX`: properly decode `text` entities

## 3.0.0

* `CHORE`: improve error handling on invalid attributes
* `CHORE`: drop lodash in favor of [min-dash](https://github.com/bpmn-io/min-dash)

## ...

Check `git log` for earlier history.