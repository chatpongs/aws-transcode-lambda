'use strict';

var AWS = require('aws-sdk');

// Set up AWS services
var s3 = new AWS.S3({
	apiVersion: '2012–09–25'
});
var eltr = new AWS.ElasticTranscoder({
	apiVersion: '2012–09–25',
	region: 'ap-southeast-1'
});

exports.handler = function (event, context) {
	console.log('Executing Elastic Transcoder Orchestrator');
	var key = event.Records[0].s3.object.key;
	var pipelineId = '1487908526309-l82jgq';
	var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces  
	var newKey = key.split('.')[0];
	
    var params = {
		PipelineId: pipelineId,
		OutputKeyPrefix: 'videos/',
		Input: {
			Key: srcKey,
			FrameRate: 'auto',
			Resolution: 'auto',
			AspectRatio: 'auto',
			Interlaced: 'auto',
			Container: 'auto'
		},
        Outputs: [{
			Key: newKey + '.mp4',
			ThumbnailPattern: 'thumbs-' + newKey + '-{count}',
			PresetId: '1351620000001-000020',
		}]
	};

	console.log('Starting Job');
	eltr.createJob(params, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
		}
		context.succeed('Job well done');
	});
};