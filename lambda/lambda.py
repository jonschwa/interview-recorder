import os
import json

# @todo - create s3 client


def lambda_handler(event, context):
    json_region = os.environ["AWS_REGION"]
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps({"Region ": json_region}),
    }
