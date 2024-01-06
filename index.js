((global) => {

  const UTILITY_RETURN_ARRAY = Symbol("UTILITY_RETURN_ARRAY");
  const UTILITY_RETURN_SET = Symbol("UTILITY_RETURN_SET");
  const UTILITY_RETURN_MAP = Symbol("UTILITY_RETURN_MAP");
  const UTILITY_RETURN_OBJECT = Symbol("UTILITY_RETURN_OBJECT");

  function isValidConstant(target) {
    const CONSTANT_SET = [UTILITY_RETURN_ARRAY, UTILITY_RETURN_SET, UTILITY_RETURN_MAP, UTILITY_RETURN_OBJECT];
    if (!CONSTANT_SET.includes(target)) return false;
    return CONSTANT_SET[CONSTANT_SET.indexOf(target)].description;
  }

  function utilityReturnType(algorithm, args) {
    const LAST_ARGUMENT = args[args.length - 1];
    const validationResult = isValidConstant(LAST_ARGUMENT);

    if (!validationResult || validationResult === UTILITY_RETURN_ARRAY.description) {
      const result = [];

      if (validationResult) args.pop();

      for (const value of args) {
        result.push(algorithm(value));
      }

      return result;
    } else {
      args.pop();
      let result;

      switch (validationResult) {
        case UTILITY_RETURN_SET.description:
          result = new Set();

          for (const value of args) {
            result.add(algorithm(value));
          }
          break;
        case UTILITY_RETURN_MAP.description:
          result = new Map();

          for (const value of args) {
            result.set(algorithm(value), algorithm(value));
          }
          break;
        case UTILITY_RETURN_OBJECT.description:
          result = {};

          for (let i = 0; i < args.length; i++) {
            Reflect.set(result, i + 1, algorithm(args[i]));
          }
          break;
      }

      return result;
    }
  }

  function typeOf(...args) {
    if (args.length) {

      if (args.length === 1) {
        let targetType = Object.prototype.toString.call(args[0]);
        targetType = targetType.substring(targetType.lastIndexOf(" "), targetType.indexOf("]")).toLowerCase().trim();

        if (targetType === "number" && String(args[0]).includes(".")) {
          targetType = "float";
        }

        return targetType;
      }

      return utilityReturnType(typeOf, args);
    }
  }

  class ElementSelector extends Array {
    event(eventName, callback) {
      for (const element of this) {
        element.addEventListener(eventName, callback);
      }
    }
  };

  function jQuery(selector, all = true) {
    if (all) return new ElementSelector(...document.querySelectorAll(selector));
    return new ElementSelector(document.querySelector(selector));
  }

  global.jQuery = jQuery;
  jQuery.UTILITY_RETURN_ARRAY = UTILITY_RETURN_ARRAY;
  jQuery.UTILITY_RETURN_SET = UTILITY_RETURN_SET;
  jQuery.UTILITY_RETURN_MAP = UTILITY_RETURN_MAP;
  jQuery.UTILITY_RETURN_OBJECT = UTILITY_RETURN_OBJECT;
  jQuery.typeOf = typeOf;
  global.$ = jQuery;

})(typeof window !== "undefined" ? window : this);