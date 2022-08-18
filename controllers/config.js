module.exports = {
    'aws': {
        'key': process.env.AWS_ACCESS_KEY_ID,
        'secret':  process.env.AWS_SECRET_ACCESS_KEY,
        'ses': {
            'from': {
                // replace with actual email address
                'default': 'eduspare@gmail.com', 
            },
            // e.g. us-west-2
            'region':  process.env.AWS_REGION
        }
    }
};