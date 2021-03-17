/***/
const NULL = null, TRUE = true, FALSE = false;
const ci = require('foonyah-ci'), os = require('os');
const ds = require('../index');

module.exports = ci.testCase({
  'current': function(t) {

    const dev = os.platform() == 'darwin' ? '/dev/disk1s2': '/dev/xvda1';
    const dir = '.';
    Promise.resolve().then(()=>{
      
      return ds.checkPart().then(r=>{
        t.ok(!!r);
        let max = r[dev];
        if(max == NULL) {
          Object.values(r).forEach(s=>{
            if(parseFloat(s.ratio) != 0 && parseFloat(s.ratio) != 100) dev = s, max = s;
          });
        }
        t.ok(max != NULL);
        t.equal(typeof max.size, 'number', dev + ': ' + max.ratio + ' is used.');
        return max.size;
      });
      
    }).then(max=>{
      
      return ds.checkDirc(dir, max).then(r=>{
        t.ok(!!r);
        t.equal(typeof r, 'object', 'Found keys: ' + Object.keys(r).length);
        // console.log(dir, max, r);
      });
      
    }).then(()=>{
      t.done();
    });

  },
  'home': function(t) {

    const dev = os.platform() == 'darwin' ? '/dev/disk1s2': '/dev/xvda1';
    const dir = os.platform() == 'darwin' ? '/Users/ystk_skm/Downloads': '/home';
    Promise.resolve().then(()=>{
      
      return ds.checkPart().then(r=>{
        t.ok(!!r);
        let max = r[dev];
        if(max == NULL) {
          Object.values(r).forEach(s=>{
            if(parseFloat(s.ratio) != 0 && parseFloat(s.ratio) != 100) dev = s, max = s;
          });
        }
        t.ok(max != NULL);
        t.equal(typeof max.size, 'number', dev + ': ' + max.ratio + ' is used.');
        return max.size;
      });
      
    }).then(max=>{
      
      return ds.checkDirc(dir, max).then(r=>{
        t.ok(!!r);
        t.equal(typeof r, 'object', 'Found keys: ' + Object.keys(r).length);
        // console.log(dir, max, r);
      });
      
    }).then(()=>{
      t.done();
    });

  }
}, 'basic.js');

