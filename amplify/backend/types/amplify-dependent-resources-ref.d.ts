export type AmplifyDependentResourcesAttributes = {
    "function": {
        "getProbateMetadata": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "probatereviewawsclient": {
            "Arn": "string"
        }
    },
    "api": {
        "probatemetadataapi": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "probatereview": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "hosting": {
        "S3AndCloudFront": {
            "Region": "string",
            "HostingBucketName": "string",
            "WebsiteURL": "string",
            "S3BucketSecureURL": "string",
            "CloudFrontDistributionID": "string",
            "CloudFrontDomainName": "string",
            "CloudFrontSecureURL": "string",
            "CloudFrontOriginAccessIdentity": "string"
        }
    },
    "auth": {
        "probatereviewa3991353": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "storage": {
        "uploads": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}