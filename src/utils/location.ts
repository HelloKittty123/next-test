  export const getDeviceOs = () => {
    const.uaparser = new UAParser(window.navigator?.userAgent);
    const result = this.uaparser.getResult();
    // console.log('browser: ', result.browser);        // {name: "Chromium", version: "15.0.874.106"}
    // console.log('device: ', result.device);         // {model: undefined, type: undefined, vendor: undefined}
    // console.log('os: ', result.os);             // {name: "Ubuntu", version: "11.10"}
    // console.log('os.version: ', result.os.version);     // "11.10"
    // console.log('engine.name: ', result.engine.name);    // "WebKit"
    // console.log('cpu.architecture: ', result.cpu.architecture);   // "amd64"
    if (!isNullOrUndefined(result)) {
      localStorage.setItem('browser', JSON.stringify(result.browser));
      localStorage.setItem('device', JSON.stringify(result.device));
      localStorage.setItem('os', JSON.stringify(result.os));
    }
  }