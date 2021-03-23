/***/
const NULL = null, TRUE = true, FALSE = false;
const ci = require('foonyah-ci'), os = require('os');
const ds = require('../index');

module.exports = ci.testCase({
  'statics': function(t) {
    
    ['checkPart', 'checkDirc', 'likely', 'ratio', 'real'].forEach(n=>{
      t.equal(typeof ds[n], 'function');
    });
    [ [25000, 100000, 25] ].forEach(pair=>{
      const n = pair[0], denomi = pair[1], ratio = pair[2];
      t.equal(ds.ratio(n, denomi), ratio, 'ratio');
      t.equal(ds.real(ratio, denomi), n, 'real');
    });
    t.done();
    
  },
  'current': function(t) {

    let dev = os.platform() == 'darwin' ? '/dev/disk1s2': '/dev/xvda1';
    const dir = '.';
    Promise.resolve().then(()=>{
      
      return ds.checkPart().then(r=>{
        t.ok(!!r);
        let max = r[dev] || ds.likely(r);
        t.ok(max != NULL);
        t.equal(typeof max.avail, 'number');
        t.equal(typeof max.used, 'number');
        t.equal(max.used + max.avail, max.size);
        t.equal(typeof max.size, 'number', max.filesystem + ': ' + max.ratio + ' is used.');
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

    let dev = os.platform() == 'darwin' ? '/dev/disk1s2': '/dev/xvda1';
    const dir = os.platform() == 'darwin' ? '/Users/ystk_skm/Downloads': '/home';
    Promise.resolve().then(()=>{
      
      return ds.checkPart().then(r=>{
        t.ok(!!r);
        let max = r[dev] || ds.likely(r);
        t.ok(max != NULL);
        t.equal(typeof max.avail, 'number');
        t.equal(typeof max.used, 'number');
        t.equal(max.used + max.avail, max.size);
        t.equal(typeof max.size, 'number', max.filesystem + ': ' + max.ratio + ' is used.');
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

