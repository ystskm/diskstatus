# diskstatus

[![Rank](https://nodei.co/npm/@ystskm/discstatus.png?downloads=true&amp;downloadRank=true&amp;stars=true)](https://nodei.co/npm/@ystskm/discstatus/)  

[![Version](https://badge.fury.io/js/@ystskm/discstatus.png)](https://npmjs.org/package/@ystskm/discstatus)
[![Build status](https://travis-ci.org/ystskm/discstatus.png)](https://travis-ci.org/ystskm/discstatus)  
  
Wrapper for Simple DiscStatus Detector.

## Install

Install with [npm](http://npmjs.org/):

    npm install @ystskm/discstatus
    
## USAGE - Set functions by args

```js
    // To begin discstatus, simply call API.
    require('@ystskm/diskstatus').checkPart();
```

```js
    // Available for specify multiple files
    require('@ystskm/diskstatus').checkDirc();
```

## OPTIONS

```js
    * position  
    * maximum
    * options 
      ... pass arbitrary directory by except function
```
