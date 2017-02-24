var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    apiVersion: '2012–09–25'
});

var eltr = new AWS.ElasticTranscoder({
    apiVersion: '2012–09–25',
    region: 'ap-southeast-1'
});

var pipelineId = '1487908526309-l82jgq';
var webPreset = '1487908526309-l82jgq';

exports.handler = function(event, context) {
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    s3.getObject({
            Bucket: bucket,
            Key: key
        },
        function(err, data) {
            console.log('err::: '+err);
            console.log('data::: '+data);
            if (err) {
                console.log('error getting object' + key + 'from bucket' + bucket +
                    '.Make sure they exist and your bucket is in the same region as this function.');
                context.done('ERROR', 'error getting file' + err);
            } else {
                console.log('Reached B');
                sendVideoToET(key);
            }
        }
    );
};

function sendVideoToET(key) {
    console.log('Sending ' + key + ' to ET');
    var params = {
        PipelineId: pipelineId,
        OutputKeyPrefix: '',
        Input: {
            Key: key,
            FrameRate: 'auto',
            Resolution: 'auto',
            AspectRatio: 'auto',
            Interlaced: 'auto',
            Container: 'auto'
        },

        Output: {
            Key: key + 'mp4',
            ThumbnailPattern: '',
            PresetId: webPreset,
            Rotate: 'auto'
        }
    };

    eltr.createJob(params, function(err, data) {

        if (err) {
            console.log('Failed to send new video' + key + 'to ET');
            console.log(err);
        } else {
            console.log(data);
        }
        // context.succeed('Job well done');
    });
}