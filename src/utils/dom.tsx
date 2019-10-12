export function addClass($els: Element|HTMLCollection, classNames: string) {
  function addOneClass($el: Element, cn: string) {
      const resultClass = $el.className.split(" ");
      const newClassNames = cn.split(" ");
      newClassNames.forEach((newClass) => {
          if (resultClass.indexOf(newClass) < 0) {
              resultClass.push(newClass);
          }
      });
      $el.className = resultClass.join(" ");
  }
  if ($els instanceof Node) {
      addOneClass($els, classNames);
  } else {
      for (let i = 0; i < $els.length; i++) {
          addOneClass($els[i] as Element, classNames);
      }
  }
}

export function removeClass($els: Element|HTMLCollection, classNames: string) {
  function removeOneClass($el: Element, cn: string) {
      const thisClass = $el.className.split(" ");
      const removeClassNames = cn.split(" ");
      const resultClass: string[] = [];
      thisClass.forEach((eachClass) => {
          if (removeClassNames.indexOf(eachClass) < 0) {
              resultClass.push(eachClass);
          }
      });
      $el.className = resultClass.join(" ");
  }
  if ($els instanceof Node) {
      removeOneClass($els, classNames);
  } else {
      for (let i = 0; i < $els.length; i++) {
          removeOneClass($els[i] as Element, classNames);
      }
  }
}

export function hasClass($el: Element, className: string): boolean {
  if ($el instanceof Node) {
      const classes = $el.className.split(" ");
      if (className && classes.indexOf(className) > -1) {
          return true;
      }
      return false;
  } else {
      return false;
  }
}