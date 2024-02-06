import $ from "jquery";

function percentage(partialValue: number, totalValue: number) {
  return (100 * partialValue) / totalValue;
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function roundNum(number: string, decPlaces: number) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces);

  // Enumerate number abbreviations
  var abbrev = ["k", "m", "b", "t"];

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3);

    // If the number is bigger or equal do the abbreviation
    if (size <= Number(number)) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      number = String(
        Math.round((Number(number) * decPlaces) / size) / decPlaces
      );

      // Handle special case where we round up to the next abbreviation
      if (Number(number) === 1000 && i < abbrev.length - 1) {
        number = String(1);
        i++;
      }

      // Add the letter for the abbreviation
      number += abbrev[i];

      // We are done... stop
      break;
    }
  }

  return number;
}

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
function checkFileType(filetype: string): boolean {
  if (SUPPORTED_FORMATS.includes(filetype)) {
    return true;
  } else {
    return false;
  }
}

function isNumberCheck(e: any) {
  e = e || window.event;
  var charCode = e.which ? e.which : e.keyCode;
  return /\d/.test(String.fromCharCode(charCode));
}

function isNumber(val: any) {
  return /^\d+$/.test(val);
}

function checkImg(src: string) {
  var jqxhr = $.get(src, function () {
    return true;
  }).fail(function () {
    return false;
  });
  return false;
}

// { name: "Story", value: 1 },
//   { name: "Poetry", value: 4 },
//   { name: "Commentary", value: 5 }
function findCategory(val: string) {
  if (val === "Story") {
    return 1;
  } else if (val === "Poetry") {
    return 4;
  } else if (val === "Commentary") {
    return 5;
  } else {
    return 0;
  }
}

function findPostType(val: string) {
  if (val === "Story") {
    return 1;
  } else if (val === "Poetry") {
    return 4;
  } else if (val === "Commentary") {
    return 5;
  } else {
    return 0;
  }
}

function findCategoryType(val: number) {
  if (val === 1) {
    return "Story";
  } else if (val === 1) {
    return "Story 100 - Words";
  } else if (val === 4) {
    return "Poetry";
  } else if (val === 5) {
    return "Commentary";
  } else {
    return 0;
  }
}

function findGenres(genres: any[]) {
  let temp: any = [];
  genres?.forEach((item, inx) => {
    temp.push(item?.title);
  });
  return temp;
}

function containsTooMuch(el: any) {
  var original = el.scrollLeft++;
  return el.scrollLeft-- > original;
}

export {
  percentage,
  getWindowDimensions,
  roundNum,
  checkFileType,
  isNumberCheck,
  findCategory,
  findPostType,
  findGenres,
  findCategoryType,
  containsTooMuch,
  isNumber,
  checkImg,
};
