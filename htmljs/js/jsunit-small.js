/*
 * Copyright (C) 2009, 2010 M. Homs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *  checkNumArgs(expected, received)<br>
 *  rendType(v)<br>
 *  expect(typeValueDesc, obtained)<br>
 *  expectedObtained(expected, obtained)<br>
 *  countProps(obj)<br>
 *  objectToString(v)<br>
 *  objectEquals(v1, v2)<br>
 *  strictObjectEquals(v1, v2)<br>
 *  
 *  isJsUnitException(object)<br>
 *  isJsUnitFailureException(object)<br>
 *  
 *  fail(message)<br>
 *
 *  equals(expected, obtained)<br>
 *  notequals(expected, obtained)<br>
 *  sequals(expected, obtained)<br>
 *  notsequals(expected, obtained)<br>
 *  equalsWithTolerance(expectedNumber, obtainedNumber, tolerance)<br>
 *
 *  arraySame(expected, obtained)<br>
 *  contains(collection, element)<br>
 *  hasProperty(object, prop)
 *  
 *  sameType(expected, obtained)<br>
 *  isNumber(value)<br>
 *  isString(value)<br>
 *  isArray(value)<br>
 *  isObject(value)<br>
 *  isFunction(value)<br>
 *  isBoolean(value)<br>
 *  
 *  isNull(obtained)<br>
 *  notNull(obtained)<br>
 *  isNaN(value)<br>
 *  notNaN(value)<br>
 *  isTrue(value)<br>
 *  isFalse(value)<br>
 *  isUndefined(obtained)<br>
 *  isDefined(obtained)<br>
 *  
 *  regexp(regexp, str)<br>
 *  
 *  negate(func)<br>
 */

//================================================================================
//================================================================================
//
// EXCEPTIONS
//
//================================================================================
//================================================================================
/**
 * exception throwed in the case of a failed assertion; supports nestable
 * exception cause, and a <tt>toString()</tt> method is provided in order to
 * generate the cause message.
 * 
 * @param assertionType
 *            the name of the failed assertion
 * @param causeMessage
 *            a message explaining the cause of an error
 * @param nestedException
 *            nested exception cause (optional argument)
 */
var JsUnitException = function(assertionType, causeMessage, nestedException) {

  if (arguments.length !== 2 && arguments.length != 3) {
    throw "JsUnitFailureException must be constructed passing a 2/3 arguments: (assertionType, causeMessage, nestedException)";
  }

  return "[JsUnitException] "
      + assertionType
      + " failure: "
      + causeMessage
      + (nestedException && nestedException.toString ? "\n\tCaused by: " + nestedException.toString()
          : "");
};

/**
 * special exception that is throwed in a case that a
 * <tt>new Assert().fail("...")</tt> is executed. Don't supports a nested
 * exception, because generally this is a root cause.
 * 
 * @param causeMessage
 */
var JsUnitFailureException = function(causeMessage) {

  if (arguments.length !== 1) {
    throw "JsUnitFailureException must be constructed passing a single argument: " + causeMessage;
  }

  return "[JsUnitFailureException] a fail(...) method executed, then a test condition is failed. message is: "
      + causeMessage;
};

// ================================================================================
// ================================================================================
//
// ASSERTIONS
//
// ================================================================================
// ================================================================================

var assert = {};

// ================================================================================
//
// ASSERTIONS.UTILS
//
// ================================================================================

assert.rendType = function(v) {
  if (v) {
    return "'" + assert.objectToString(v) + "' (" + typeof (v) + ")";
  }
  return "'" + v + "'";
};

assert.expectedObtained = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);
  return "Expected: " + assert.rendType(expected) + ", but obtained: " + assert.rendType(obtained);
};

assert.expect = function(typeValueDesc, obtained) {
  assert.checkNumArgs(2, arguments.length);
  return "Expected " + typeValueDesc + ", but obtained: " + assert.rendType(obtained);
};

assert.checkNumArgs = function(expected, received) {

  if (expected !== received) {
    throw JsUnitException("assert.checkNumArgs",
        "wrong number of arguments passed to a function; Expected: " + expected + ", but received: "
            + received);
  }
};

assert.countProps = function(obj) {
  var count = 0;
  for (k in obj) {
    if (obj.hasOwnProperty(k)) {
      count++;
    }
  }
  return count;
};

assert.strictObjectEquals = function(v1, v2) {

  if (typeof (v1) !== typeof (v2)) {
    return false;
  }

  if (typeof (v1) === "function") {
    return v1.toString() === v2.toString();
  }

  if (v1 instanceof Object && v2 instanceof Object) {
    if (assert.countProps(v1) !== assert.countProps(v2)) {
      return false;
    }
    var r = true;
    for (k in v1) {
      r = assert.strictObjectEquals(v1[k], v2[k]);
      if (!r) {
        return false;
      }
    }
    return true;
  }

  return v1 === v2;
};

assert.objectEquals = function(v1, v2) {

  if (typeof (v1) === "function" || typeof (v2) === "function") {
    if (typeof (v1) === "function" && typeof (v2) === "function") {
      return v1.toString() == v2.toString();
    }

    if (typeof (v1) === "function") {
      return v1.toString() == v2;
    }
    return v2.toString() == v1;
  }

  if (v1 instanceof Object && v2 instanceof Object) {
    if (assert.countProps(v1) !== assert.countProps(v2)) {
      return false;
    }
    var r = true;
    for (k in v1) {
      r = assert.objectEquals(v1[k], v2[k]);
      if (!r) {
        return false;
      }
    }
    return true;
  }

  return v1 == v2;
};

assert.objectToString = function(v) {

  if (typeof (v) === "function") {
    return v.toString();
  }

  if (v instanceof Array) {
    return v.toString();
  } else if (v instanceof Object) {
    var r = "{";
    for (k in v) {
      r += k + ":" + assert.objectToString(v[k]) + ",";
    }
    return r + "}";
  } else {
    return v.toString();
  }
};

assert.objectLength = function(o) {
  if (!o instanceof Object) {
    return -1;
  }
  if (o.length === undefined) {
    return assert.countProps(o);
  }
  return o.length;
};

// ================================================================================
//
// ASSERTIONS.ASSERTIONS
//
// ================================================================================

/**
 * @param message
 *            the failure message that will be wrapped with the exception
 * @throws JsUnitFailureException
 */
assert.fail = function(message) {
  throw JsUnitFailureException(message ? message : "fail() method invoked, it means a test failure");
};

/**
 * asserts that an object is instance of JsUnitException.
 * 
 * @param object
 *            object that must be checked
 * @throws JsUnitException
 *             if the object is not an instance of JsUnitException
 */
assert.isJsUnitException = function(object) {
  assert.checkNumArgs(1, arguments.length);

  if (object === null) {
    throw JsUnitException("isJsUnitException",
        "Expected a JsUnitException object, but obtained other: null");
  }

  if (typeof (object) !== "string" || object.match(/^\[JsUnitException\]/) == -1) {
    throw JsUnitException("isJsUnitException", "Expected a JsUnitException object, but obtained other"
        + (object && object.toString ? ": " + object.toString() : "undefined"));
  }
};

assert.isJsUnitFailureException = function a(object) {
  assert.checkNumArgs(1, arguments.length);

  if (object === null) {
    throw JsUnitException("isJsUnitFailureException",
        "Expected a JsUnitFailureException object, but obtained other: null");
  }

  if (!object instanceof JsUnitFailureException) {
    throw JsUnitException("isJsUnitFailureException",
        "Expected a JsUnitFailureException object, but obtained other"
            + (object && object.toString ? ": " + object.toString() : "undefined"));
  }
};

assert.equals = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);

  if (!assert.objectEquals(expected, obtained)) {
    throw JsUnitException("equals", assert.expectedObtained(expected, obtained));
  }
};

assert.notequals = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);

  if (assert.objectEquals(expected, obtained)) {
    throw JsUnitException("notequals", assert.expectedObtained(expected, obtained));
  }
};

assert.sequals = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);

  if (!assert.strictObjectEquals(expected, obtained)) {
    throw JsUnitException("sequals", assert.expectedObtained(expected, obtained));
  }
};

assert.notsequals = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);

  if (assert.strictObjectEquals(expected, obtained)) {
    throw JsUnitException("notsequals", assert.expectedObtained(expected, obtained));
  }
};

assert.isNull = function(obtained) {
  assert.checkNumArgs(1, arguments.length);

  if (obtained !== null) {
    throw JsUnitException("isNull", assert.expect("a null value", obtained));
  }
};

assert.notNull = function(obtained) {
  assert.checkNumArgs(1, arguments.length);

  if (obtained === null) {
    throw JsUnitException("notNull", assert.expect("a not-null value", obtained));
  }
};

assert.isDefined = function(obtained) {
  assert.checkNumArgs(1, arguments.length);

  if (obtained === undefined) {
    throw JsUnitException("isDefined", assert.expect("a defined value", obtained));
  }
};

assert.isUndefined = function(obtained) {
  assert.checkNumArgs(1, arguments.length);

  if (obtained !== undefined) {
    throw JsUnitException("isUndefined", assert.expect("an undefined value", obtained));
  }
};

assert.isFunction = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "function") {
    throw JsUnitException("isFunction", assert.expect("a function type", value));
  }
};

assert.isBoolean = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "boolean") {
    throw JsUnitException("isBoolean", assert.expect("a boolean type", value));
  }
};

assert.isString = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "string") {
    throw JsUnitException("isString", assert.expect("a string type", value));
  }
};

assert.isNumber = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "number") {
    throw JsUnitException("isNumber", assert.expect("a number type", value));
  }
};

assert.isTrue = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "boolean" || value !== true) {
    throw JsUnitException("isTrue", assert.expect("a boolean type with true value", value));
  }
};

assert.isFalse = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "boolean" || value === true) {
    throw JsUnitException("isFalse", assert.expect("a boolean type with false value", value));
  }
};

assert.isArray = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (!value || !value instanceof Array || value.length === undefined) {
    throw JsUnitException("isArray", assert.expect("an Array", value));
  }
};

assert.isObject = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (!value instanceof Object) {
    throw JsUnitException("isObject", assert.expect("an Object", value));
  }
};

assert.sameType = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);

  if (!assert.strictObjectEquals(typeof (expected), typeof (obtained))) {
    throw JsUnitException("sameType", "Expected a type: '" + typeof (expected) + "', but obtained: '"
        + typeof (obtained) + "'");
  }
};

assert.notNaN = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (value === null || value === undefined) {
    return;
  }

  if (typeof (value) !== "number") {
    throw JsUnitException("notNaN", "Expected a number type, but obtained: '" + typeof (value) + "'");
  }

  if (isNaN(value)) {
    throw JsUnitException("notNaN", assert.expect("a not-Nan number type", value));
  }
};

assert.isNaN = function(value) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (value) !== "number") {
    throw JsUnitException("isNaN", "Expected a number type, but obtained: '" + typeof (value) + "'");
  }

  if (!isNaN(value)) {
    throw JsUnitException("isNaN", assert.expect("a Nan number type", value));
  }
};

assert.equalsWithTolerance = function(expectedNumber, obtainedNumber, tolerance) {
  assert.checkNumArgs(3, arguments.length);

  if (typeof (expectedNumber) !== "number" || typeof (obtainedNumber) !== "number"
      || typeof (tolerance) !== "number") {
    throw JsUnitException("equalsWithTolerance", "all arguments has to be of numeric type");
  }

  if (Math.abs(expectedNumber - obtainedNumber) > tolerance) {
    throw JsUnitException("equalsWithTolerance", "Expected that abs(" + expectedNumber + " - "
        + obtainedNumber + ") <= " + tolerance);
  }
};

/**
 * @param collection
 *            an array/object element
 * @param element
 *            the element
 * @throws JsUnitException
 *             if the array does not contains the specified element
 */
assert.contains = function(collection, element) {
  assert.checkNumArgs(2, arguments.length);

  if (!collection instanceof Object) {
    throw JsUnitException("contains", "the first argument is not an Array/Object instance");
  }

  for (e in collection) {
    if (element === collection[e]) {
      return;
    }
  }

  throw JsUnitException("contains", "element '" + element + "' is not contained in Array/Object:"
      + assert.objectToString(collection));
};

assert.hasLength = function(object, length) {
  assert.checkNumArgs(2, arguments.length);

  if (object === null || length === null) {
    throw JsUnitException("hasLength", "expected 2 not-null arguments");
  }
  if (assert.objectLength(object) !== length) {
    throw JsUnitException("hasLength", "expected an Array/Object of lenght=" + length
        + " but obtained the length: " + assert.objectLength(length));
  }
};

assert.arraySame = function(expected, obtained) {
  assert.checkNumArgs(2, arguments.length);

  if (!expected instanceof Array) {
    throw JsUnitException("arraySame", "the first argument is not an Array instance");
  }

  if (!obtained instanceof Array) {
    throw JsUnitException("arraySame", "the second argument is not an Array instance");
  }

  if (expected.sort().toString() !== obtained.sort().toString()) {
    throw JsUnitException("arraySame", assert.expectedObtained(assert.objectToString(expected), assert
        .objectToString(obtained)));
  }
};

/**
 * negate a test method
 * 
 * @param func
 *            function with 0-arguments that is expected to fail
 */
assert.negate = function(func) {
  assert.checkNumArgs(1, arguments.length);

  if (typeof (func) !== "function") {
    throw JsUnitException("negate", "first argument must be a function");
  }

  try {
    func();
    throw JsUnitException("negate", "expects for a function that fails on evaluate");
  } catch (e) {
  }
};

assert.regexp = function(regexp, str) {
  assert.checkNumArgs(2, arguments.length);

  if (!regexp instanceof Object) {
    throw JsUnitException("regexp", "first argument must be a regexp (object)");
  }
  if (typeof (str) !== "string") {
    throw JsUnitException("regexp", "second argument must be a String");
  }

  if (!str.match(regexp)) {
    throw JsUnitException("regexp", "literal '" + str + "' not matched by regexp: " + regexp);
  }
};

assert.hasProperty = function(object, prop) {

  if (!object instanceof Object) {
    throw JsUnitException("hasProperty", "first argument must be an Object");
  }
  if (object[prop] === undefined) {
    throw JsUnitException("hasProperty", "property " + prop + " is undefined for object: "
        + assert.objectToString(object) + "");
  }
};

// ================================================================================
// ================================================================================
//
// FLUENT ASSERTIONS
//
// ================================================================================
// ================================================================================

function Fluent(v) {

  this.v = v;

  this.isJsUnitException = function() {
    assert.isJsUnitException(this.v);
    return this;
  };
  this.isJsUnitFailureException = function() {
    assert.isJsUnitFailureException(this.v);
    return this;
  };
  this.fail = function(message) {
    assert.fail(message);
    return this;
  };
  this.equals = function(v) {
    assert.equals(v, this.v);
    return this;
  };
  this.notequals = function(v) {
    assert.notequals(v, this.v);
    return this;
  };
  this.sequals = function(v) {
    assert.sequals(v, this.v);
    return this;
  };
  this.notsequals = function(v) {
    assert.notsequals(v, this.v);
    return this;
  };
  this.equalsWithTolerance = function(v, tolerance) {
    assert.equalsWithTolerance(v, this.v, tolerance);
    return this;
  };
  this.arraySame = function(v) {
    assert.arraySame(v, this.v);
    return this;
  };
  this.contains = function(element) {
    assert.contains(this.v, element);
    return this;
  };
  this.hasLength = function(len) {
    assert.hasLength(this.v, len);
    return this;
  };
  this.hasProperty = function(prop) {
    assert.hasProperty(this.v, prop);
    return this;
  };
  this.sameType = function(v) {
    assert.sameType(v, this.v);
    return this;
  };
  this.isNumber = function() {
    assert.isNumber(this.v);
    return this;
  };
  this.isString = function() {
    assert.isString(this.v);
    return this;
  };
  this.isArray = function() {
    assert.isArray(this.v);
    return this;
  };
  this.isObject = function() {
    assert.isObject(this.v);
    return this;
  };
  this.isFunction = function() {
    assert.isFunction(this.v);
    return this;
  };
  this.isBoolean = function() {
    assert.isBoolean(this.v);
    return this;
  };
  this.isNull = function() {
    assert.isNull(this.v);
    return this;
  };
  this.notNull = function() {
    assert.notNull(this.v);
    return this;
  };
  this.isNaN = function() {
    assert.isNaN(this.v);
    return this;
  };
  this.notNaN = function() {
    assert.notNaN(this.v);
    return this;
  };
  this.isTrue = function() {
    assert.isTrue(this.v);
    return this;
  };
  this.isFalse = function() {
    assert.isFalse(this.v);
    return this;
  };
  this.isUndefined = function() {
    assert.isUndefined(this.v);
    return this;
  };
  this.isDefined = function() {
    assert.isDefined(this.v);
    return this;
  };
  this.regexp = function(regexp) {
    assert.regexp(regexp, this.v);
    return this;
  };
}

assert.fluent = function(v) {
  return new Fluent(v);
};

// ================================================================================
// ================================================================================
//
// TEST-CASE-RUNNER
//
// ================================================================================
// ================================================================================

var runner = {};

// ================================================================================
//
// TEST-CASE-RUNNER.OUTPUT-HANDLERS
//
// ================================================================================

runner.silentOutputHandler = function(message) {
};

runner.printlnOutputHandler = function(message) {
  try {
    println(message);
  } catch (e) {
    // in-browser execution, this function is not available;
    // redirects to console.log()
    try {
      console.log(message);
    } catch (e) {
      // do nothing
    }
  }
};

runner.consoleLogOutputHandler = function(message) {
  console.log(message);
};

runner.documentOutputHandler = function(message) {
  document.write( //
      message //
          .replace("<", "&lt;") //
          .replace(">", "&gt;") //
          .replace("OK ", "<b style='color:green'>&nbsp;OK&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>") //
          .replace("FAILED ",
              "<b style='color:white;background-color:red'>&nbsp;FAILED&nbsp;</b>&nbsp;") //
          .replace("*OK*",
              "<b style='color:white;background-color:green'>&nbsp;&nbsp;&nbsp;OK&nbsp;&nbsp;&nbsp;</b>") //
          .replace("\n", "<br>") //
          + "<br>");
};

// ================================================================================
//
// TEST-CASE-RUNNER.TEST-RUNNER
//
// ================================================================================

/**
 * @param outputHandler
 * @param throwOnFailedTestCasep
 *            (optional)
 */
runner.TestCaseRunner = function(outputHandler, throwOnFailedTestCasep) {

  if (outputHandler === undefined) {
    throw "TestCaseRunner must be constructed passing an outputHandler implementation as an argument";
  }

  this.outputHandler = outputHandler;
  this.throwOnFailedTestCase = throwOnFailedTestCasep;

  this.executeTestMethod = function(object, methodName) {
    try {
      eval("if(object." + methodName + "!=undefined) object." + methodName + "();");
    } catch (e) {
      throw JsUnitException("execing '" + methodName + "' method", "", e);
    }
  };

  this.run = function(testCaseObject) {

    var executedTests = 0;
    var failedTests = 0;
    var totalElapsedTime = new Date().getTime();

    var firstExc = null;

    // executa beforeClass
    try {
      this.executeTestMethod(testCaseObject, "beforeClass");
    } catch (e) {
      if (!firstExc) {
        firstExc = e;
      }
      failedTests++;
      this.outputHandler("\nFAILED 0/0 failures, execing 'beforeClass' method. error is: "
          + e.toString() + "\n");
      if (this.throwOnFailedTestCase) {
        throw JsUnitException("Failed Test Case", "with " + result, e);
      }
    }

    if (failedTests === 0) {
      for ( var prop in testCaseObject) {
        if (prop.match(/^test/)) {

          try {

            // executa beforeMethod
            try {
              this.executeTestMethod(testCaseObject, "before");
            } catch (e) {
              if (!firstExc) {
                firstExc = e;
              }
              throw JsUnitException("Failed Test Case", "in " + prop + ".before method", e);
            }

            var start = new Date().getTime();

            // executa mtode
            testCaseObject[prop]();

            var elapsed = new Date().getTime() - start;

            // executa afterMethod
            try {
              this.executeTestMethod(testCaseObject, "after");
            } catch (e) {
              if (!firstExc) {
                firstExc = e;
              }
              throw JsUnitException("Failed Test Case", "in " + prop + ".after method", e);
            }

            this.outputHandler("OK     " + prop + " in " + elapsed / 1000 + "s.");
            executedTests++;

          } catch (e) {
            if (!firstExc) {
              firstExc = e;
            }
            this.outputHandler("FAILED " + prop + " Cause is: " + e.toString());
            failedTests++;
          }
        } // if
      } // for
    } // if

    // executa afterClass
    try {
      this.executeTestMethod(testCaseObject, "afterClass");
    } catch (e) {
      if (!firstExc) {
        firstExc = e;
      }
      failedTests++;
      this.outputHandler("\nFAILED " + failedTests + "/" + executedTests
          + " failures, execing 'afterClass' method. error is: " + e.toString() + "\n");
      if (this.throwOnFailedTestCase) {
        throw JsUnitException("Failed Test Case", "with " + result, e);
      }
    }

    totalElapsedTime = new Date().getTime() - totalElapsedTime;
    var result = failedTests + "/" + executedTests + " failures, in " + totalElapsedTime / 1000 + "s.\n";
    if (failedTests === 0) {
      this.outputHandler("\n*OK*     " + result);
    } else {
      this.outputHandler("\nFAILED " + result);
      if (this.throwOnFailedTestCase) {
        throw JsUnitException("Failed Test Case", "with " + failedTests + "/" + executedTests
            + " failures", firstExc);
      }
    }
  };

};

// ================================================================================
//
// TEST-CASE-RUNNER.PREDEFINED-TEST-RUNNERS
//
// ================================================================================

/**
 * @param testCase
 * @param throwOnFailedTestCase
 *            (optional)
 */
runner.printlnTestCaseRunner = function(testCase, throwOnFailedTestCase) {
  if (arguments.length !== 1 && arguments.length !== 2) {
    throw JsUnitException("printlnTestCaseRunner",
        "wrong arguments, must be (testCase, [throwOnFailedTestCase])");
  }
  var caseRunner = new runner.TestCaseRunner(runner.printlnOutputHandler, throwOnFailedTestCase);
  caseRunner.run(testCase);
};

runner.consoleLogTestCaseRunner = function(testCase, throwOnFailedTestCase) {
  if (arguments.length !== 1 && arguments.length !== 2) {
    throw JsUnitException("printlnTestCaseRunner",
        "wrong arguments, must be (testCase, [throwOnFailedTestCase])");
  }
  var caseRunner = new runner.TestCaseRunner(runner.consoleLogOutputHandler, throwOnFailedTestCase);
  caseRunner.run(testCase);
};
/**
 * @param testCase
 * @param throwOnFailedTestCase
 *            (optional)
 */
runner.documentTestCaseRunner = function(testCase, throwOnFailedTestCase) {
  if (arguments.length !== 1 && arguments.length !== 2) {
    throw JsUnitException("documentTestCaseRunner",
        "wrong arguments, must be (testCase, [throwOnFailedTestCase])");
  }
  var caseRunner = new runner.TestCaseRunner(runner.documentOutputHandler);
  caseRunner.run(testCase);
};

/**
 * @param testCase
 * @param throwOnFailedTestCase
 *            (optional)
 */
runner.silentTestCaseRunner = function(testCase, throwOnFailedTestCase) {
  if (arguments.length !== 1 && arguments.length !== 2) {
    throw JsUnitException("silentTestCaseRunner",
        "wrong arguments, must be (testCase, [throwOnFailedTestCase])");
  }
  var caseRunner = new runner.TestCaseRunner(runner.silentOutputHandler, throwOnFailedTestCase);
  caseRunner.run(testCase);
};

// ================================================================================
//
// ABOUT
//
// ================================================================================

var jsUnit = {
  name : "small-JsUnit, written by m. homs",
  version : "0.0.1",
  assertionsAvailable : function(object) {
    var total = 0;
    for ( var memberName in object) {
      var funktion = object[memberName].toString();
      var functionName = funktion.substring(funktion.indexOf("("), funktion.indexOf(")") + 1);
      println(" *  " + memberName + functionName + "<br>");
      total++;
    }
    println(" *  ==========================================");
    println(" *  total " + total + " assertions available");
  }
};

// jsUnit.assertionsAvailable(assert);
