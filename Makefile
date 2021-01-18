API_NAME=interview-audio-to-s3
REGION=us-east-1
CONTAINER_PREFIX=interview-recorder

run-lambda:
	make package-lambda
	docker-compose up

run-local: run-lambda
	make build-local

build-local:
	$(eval API_ID:= $(shell docker exec -it ${CONTAINER_PREFIX}.localstack awslocal apigateway get-rest-apis --query "items[?name==\`${API_NAME}\`].id" --output text --region ${REGION}))	
	@echo ${API_ID}
	@eval APIG_ID=${API_ID} npm run build

package-lambda:
	@exec zip -j ./lambda/dist/api-handler.zip ./lambda/lambda.py
	@exec chmod 666 ./lambda/dist/api-handler.zip