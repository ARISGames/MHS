function getBox(app) {
  if (app.width / app.height > 9 / 16) {
    // window is wider than ipod. boxes on left/right
    var w = app.height * (9 / 16);
    return {
      width: w,
      height: app.height,
      x: (app.width - w) / 2,
      y: 0,
    };
  } else {
    // window is taller than ipod. boxes on top/bottom
    var h = app.width * (16 / 9);
    return {
      width: app.width,
      height: h,
      x: 0,
      y: (app.height - h) / 2,
    };
  }
}
