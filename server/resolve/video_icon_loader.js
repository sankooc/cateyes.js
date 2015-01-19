/**
 * Created by sankooc on 1/19/15.
 */

var fs = require('fs')
var async = require('async');
var apply = async.apply;
var httpx = require('./httpx')
var http = require('http');
var mkdirp = require('mkdirp')
var moment = require('moment')
var _ = require('underscore')
var request = require('request')

function load(url,callback){
  async.waterfall([
  apply(httpx.getDocument,url)
  ,function($,callback) {
      var img_url = $('.pl-header-thumb>img').attr('src');
      var _url = 'https:'+img_url;
      console.log(_url);
      request.get(_url).pipe(fs.createWriteStream('icon.jpg'));
  }],callback);
}