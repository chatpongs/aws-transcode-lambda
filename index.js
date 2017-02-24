'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
	apiVersion: '2012–09–25'
});
var eltr = new AWS.ElasticTranscoder({
	apiVersion: '2012–09–25',
	region: 'ap-southeast-1'
});
exports.handler = function (event, context) {
	console.log('Executing Elastic Transcoder Orchestrator');
	var bucket = event.Records[0].s3.bucket.name;
	var key = event.Records[0].s3.object.key;
	var pipelineId = '1487908526309-l82jgq';
	// if (bucket !== 'acloud - video - input') {
	// 	context.fail('Incorrect Video Input Bucket');
	// 	return;
	// }
	var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces  
	var newKey = key.split('.')[0];
	var params = {
		PipelineId: pipelineId,
		OutputKeyPrefix: newKey + '/',
		Input: {
			Key: srcKey,
			FrameRate: 'auto',
			Resolution: 'auto',
			AspectRatio: 'auto',
			Interlaced: 'auto',
			Container: 'auto'
		},
        Outputs: [{
			Key: 'mp4-' + newKey + '.mp4',
			ThumbnailPattern: 'thumbs-' + newKey + '-{count}',
			PresetId: '1351620000001-000020',
		}]
		// Outputs: [{
		// 	Key: 'mp4-' + newKey + '.mp4',
		// 	ThumbnailPattern: 'thumbs-' + newKey + '-{count}',
		// 	PresetId: '1351620000001–000010', //Generic 720p
		// 	Watermarks: [{
		// 		InputKey: 'watermarks/logo-horiz-large.png',
		// 		PresetWatermarkId: 'BottomRight'
		// 	}],
		// }, {
		// 	Key: 'webm-' + newKey + '.webm',
		// 	ThumbnailPattern: '',
		// 	PresetId: '1351620000001–100240', //Webm 720p
		// 	Watermarks: [{
		// 		InputKey: 'watermarks/logo-horiz-large.png',
		// 		PresetWatermarkId: 'BottomRight'
		// 	}],
		// }, {
		// 	Key: 'hls-' + newKey + '.ts',
		// 	ThumbnailPattern: '',
		// 	PresetId: '1351620000001–200010', //HLS v3 2mb/s
		// 	Watermarks: [{
		// 		InputKey: 'watermarks/logo-horiz-large.png',
		// 		PresetWatermarkId: 'BottomRight'
		// 	}],
		// }]
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