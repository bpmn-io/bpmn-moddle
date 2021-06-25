# Changelog

All notable changes to [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 7.1.2

* `FIX`: make `bpmn:InteractionNode` include `bpmn:CallActivity`

## 7.1.1

* `FIX`: properly inline BPMN in Color schema ([#88](https://github.com/bpmn-io/bpmn-moddle/pull/88))

## 7.1.0

* `FEAT`: add BPMN in Color schema ([#87](https://github.com/bpmn-io/bpmn-moddle/pull/87))
* `CHORE`: update dependencies

## 7.0.5

* `FIX`: correct serialization of `xml` prefixed attributes on `Any` elements
* `CHORE`: update to `moddle-xml@9.0.5`

## 7.0.4

* `CHORE`: update to `moddle-xml@9.0.4`

## 7.0.3

* `CHORE`: update to `moddle-xml@9.0.3`

## 6.0.7

* `CHORE`: update to `moddle-xml@8.0.8`

## 7.0.2

* `FIX`: recursively log nested namespaces as used ([#78](https://github.com/bpmn-io/bpmn-moddle/pull/78))
* `CHORE`: update to `moddle-xml@9.0.2`

## 6.0.6

* `FIX`: recursively log nested namespaces as used ([#78](https://github.com/bpmn-io/bpmn-moddle/pull/78))
* `CHORE`: update to `moddle-xml@8.0.7`

## 6.0.5

* `FIX`: account for local namespace declaration overrides ([#76](https://github.com/bpmn-io/bpmn-moddle/pull/76))
* `CHORE`: bump to `moddle-xml@8.0.6`

## 7.0.1

* `FIX`: account for local namespace declaration overrides ([#75](https://github.com/bpmn-io/bpmn-moddle/pull/75))
* `CHORE`: bump to `moddle-xml@9.0.1`

## 7.0.0

* `FEAT`: promisify `fromXML` and `toXML` APIs. ([#73](https://github.com/bpmn-io/bpmn-moddle/pull/73))

### Breaking Changes

* `fromXML` and `toXML` APIs now return a Promise. Support for callbacks is dropped. Refer to the [documentation](https://github.com/bpmn-io/bpmn-moddle#usage) for updated usage information.

## 6.0.4

* `CHORE`: bump to `moddle-xml@8.0.5`

## 6.0.3

* `CHORE`: bump to `moddle-xml@8.0.3`
* `CHORE`: bump to `min-dash@3.5.2`

## 6.0.2

* `FIX`: correct `DataAssociation#assignment` serialization ([#68](https://github.com/bpmn-io/bpmn-moddle/pull/68))

## 6.0.1

* `CHORE`: bump to `moddle-xml@8.0.2`

## 6.0.0

* `FEAT`: add pre-built distribution
* `CHORE`: update to `moddle@5.0.1`, `moddle-xml@8.0.1`

## 5.2.0

* `FEAT`: validate ID attributes as QNames

## 5.1.6

* `FIX`: correct `Choreography` model definitions ([#59](https://github.com/bpmn-io/bpmn-moddle/issues/59))

## 5.1.5

* `FIX`: correct `StandardLoopCharacteristics#loopMaximum` type ([#56](https://github.com/bpmn-io/bpmn-moddle/issues/56))

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
