/**
 * Index file for DiskStatus
 * Usage: 
 *   DiskStatus.checkDisk( [path, [options]] )
 *   DiskStatus.checkDirc( [path, [options]] )
 * コマンドラインを通じた使用量等の把握
 */
(function() {

  const NULL = null, TRUE = true, FALSE = false, UNDEF = undefined;
  const os = require('os'), fs = require('fs'), cp = require('child_process');
  const staticFncs = {
    checkPart, checkDirc, likely
  };
  Object.keys( staticFncs ).forEach(function(k) {
    DiskStatus[ k ] = staticFncs[ k ];
  });
  
  module.exports = DiskStatus;
  return; // <-- END_OF_MAIN <--

  /**
   * @static DiskStatus
   * @returns
   */
  function DiskStatus() {
  
  }

  /**
   * 
   * @param @optional <Object> options
   * @returns
   */
  function checkPart(options) {
    // os = require('os'), cp = require('child_process');
    const p = os.platform();
    let opts = Object.assign({ except: disk=>{ return !disk || disk.indexOf('/dev/') != 0 || disk.indexOf('/dev/loop') == 0 } }, options);
    let cmd;
    switch(TRUE) {

    // 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'
    case p == 'win32':
      cmd;
      return forWin();

    case p == 'darwin':
    case p == 'linux':
    default:
      cmd = 'df -h';
      return forLinux();

    }
    function forLinux() {

      let rd = { };
      return Promise.resolve().then(()=>{
        return new Promise((rsl, rej)=>{
          const issue = [cmd, '| awk \'{ print $1,$2,$3 }\''].join(' ');
          // outLog('cmd:', issue);
          cp.exec(issue, (e, d)=>e ? rej(e): rsl( String(d).split(os.EOL) ));
        }).then(d=>{
          let header;
          d.forEach((t, i)=>{
            if(i === 0) return header = t.split(/\s/).map(t=>t.toLowerCase());
            const values = t.split(/\s/).map(u2i);
            const rp = values[0];
            if(values.length != header.length || opts.except( rp )) return; // => ignore
            const one = rd[rp] = { };
            header.forEach((h, i)=>one[h] = values[i]);
            if(one.size != NULL && one.used != NULL) { one.ratio = parseInt(one.used / one.size * 10000) / 100 + '%'; }
          });
        });
      }).then(()=>{
        // outLog(rd); // TODO comment-out
        return rd;
      });

    }
    function forWin() {
      return Promise.reject('[checkPart] Not supported platform ' + p + ' yet');
    }
  }

  /**
   * 
   * @param <String> position
   * @param <Number> maximum
   * @param @optional <Object> options
   * @returns
   */
  function checkDirc(position, maximum, options) {
    // os = require('os'), cp = require('child_process');
    const p = os.platform();
    let pos = position || '/';
    let max = maximum  || Math.pow(10, 9);
    let opts = Object.assign({ except: rp=>{ return !rp } }, options);
    let cmd;
    switch(TRUE) {

    // 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'
    case p == 'win32':
      pos = pos.replace(/\//g, '¥');
      if(pos.charAt(1) != ':') { pos = 'c:' + pos; }
      cmd;
      return forWin();

    case p == 'darwin':
      cmd = 'du -d 1 -h';
      return forLinux();
      
    case p == 'linux':
    default:
      cmd = 'du -h --max-depth=1';
      return forLinux();

    }
    function forLinux() {

      // os = require('os'), cp = require('child_process');
      let rd = { };
      return Promise.resolve().then(()=>{
        return new Promise((rsl, rej)=>{
          const issue = [cmd, pos, '| awk \'{ print $1,$2 }\''].join(' ');
          // outLog('cmd:', issue);
          cp.exec(issue, (e, d)=>e ? rej(e): rsl( String(d).split(os.EOL) ));
        }).then(d=>{
          let header = ['used', 'filepath'];
          d.forEach((t, i)=>{
            const values = t.split(/\s/).map(u2i);
            const rp = (pos == '/' ? '': pos) + String(values[1] || '').substr(1);
            if(values.length != header.length || opts.except( rp )) return; // => ignore
            const one = rd[rp] = { };
            header.forEach((h, i)=>one[h] = values[i]);
            if(max != NULL && one.used != NULL) { one.ratio = parseInt(one.used / max * 10000) / 100 + '%'; }
          });
        });
      }).then(()=>{
        // outLog(rd); // TODO comment-out
        return rd;
      });

    }
    function forWin() {
      return Promise.reject('[checkDirc] Not supported platform ' + p + ' yet');
    }
  }
  
  /**
   * 
   */
  function likely(r) {
    let max;
    Object.values(r || { }).forEach(s=>{
      if(parseFloat(s.ratio) != 0 && parseFloat(s.ratio) != 100) max = s;
    });
    return max;
  }
  
  // ----- //
  function u2i(t) {
    const mtc = t.match(/^([\d\.]+)([PTGMKB]i?)?$/i); // Pbyte ~ Kbyte
    if(mtc == NULL || /^\.+$/.test(mtc[1])) return t;
    // console.log(mtc);
    let exp = 1;
    switch(TRUE) {
    case /Pi?/i.test(mtc[2]):
      exp *= Math.pow(10, 3);
    case /Ti?/i.test(mtc[2]):
      exp *= Math.pow(10, 3);
    case /Gi?/i.test(mtc[2]):
      exp *= Math.pow(10, 3);
    case /Mi?/i.test(mtc[2]):
      exp *= Math.pow(10, 3);
    case /Ki?/i.test(mtc[2]):
      exp *= Math.pow(10, 3);
    case /Bi?/i.test(mtc[2]):
    default:
      exp *= 1;
    }
    return parseFloat(mtc[1]) * exp;
  }

  // ----- //
  function outLog() {
    console.log.apply(console, _getLogArgs(arguments));
  }
  function outWarn() {
    console.warn.apply(console, _getLogArgs(arguments));
  }
  function _getLogArgs(a) {
    var args = Array.prototype.slice.call(a);
    args.unshift(new Date().toGMTString() + ' - [DiskStatus]');
    return args;
  }
  
  // ----- //
  function clone(x) {
    if(x == NULL) {
      return x;
    }
    if(!isArray(x) && !is('object', x)) {
      switch(TRUE) {
      case x instanceof Date:
        return new Date(x);
      default:
        return x;
      }
    }
    var new_x;
    if(isArray(x)) {
      new_x = [ ];
      x.forEach(function(v) {
        new_x.push(clone(v));
      });
    } else {
      new_x = { };
      Object.keys(x).forEach(function(k) {
        new_x[k] = clone(x[k]);
      });
    }
    return new_x;
  }
  
  // ----- //
  function is(ty, x) {
    return typeof x == ty;
  }
  function isFunction(x) {
    return is('function', x);
  }
  function isArray(x) {
    return Array.isArray(x);
  }

})();