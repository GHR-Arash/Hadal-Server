@echo off
set AWS_PROFILE=localstack
set AWS_DEFAULT_REGION=us-east-1
aws dynamodb batch-write-item --endpoint-url http://localhost:4566 --request-items file://seed-data/workspaces.json
