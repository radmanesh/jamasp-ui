const checkAllTrue = (objects) => {
  //console.log(objects);
  if (objects===undefined || objects===null) throw new Error("Object is undefined");
  if (Array.isArray(objects)) {
    for (const obj of objects) {
      if (!obj) return false;
    }
    return true;
  } else {
    return false;
  }
};

export { checkAllTrue };

