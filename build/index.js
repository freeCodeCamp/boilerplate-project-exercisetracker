"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const listener = app_1.app.listen(process.env.PORT || 3000, () => {
    const address = listener.address();
    console.log("App is listening on port " + address.port);
});
