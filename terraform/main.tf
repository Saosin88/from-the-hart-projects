resource "aws_lambda_function" "from_the_hart_projects_lambda_function" {
  function_name = "from-the-hart-projects"
  package_type  = "Image"
  image_uri     = "709961728029.dkr.ecr.af-south-1.amazonaws.com/from-the-hart-projects:latest"
  timeout       = 10
  role          = data.terraform_remote_state.shared.outputs.from_the_hart_lambda_role_arn
}

resource "aws_apigatewayv2_integration" "from_the_hart_projects_integration" {
  api_id = data.terraform_remote_state.shared.outputs.api_gateway_id

  integration_uri        = aws_lambda_function.from_the_hart_projects_lambda_function.invoke_arn
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "1.0"
}

resource "aws_apigatewayv2_route" "from_the_hart_projects_get_route" {
  api_id = data.terraform_remote_state.shared.outputs.api_gateway_id

  route_key          = "GET /projects"
  target             = "integrations/${aws_apigatewayv2_integration.from_the_hart_projects_integration.id}"
  authorizer_id      = data.terraform_remote_state.shared.outputs.api_gateway_cloudfront_token_authorizer_id
  authorization_type = "CUSTOM"
}

resource "aws_apigatewayv2_route" "from_the_hart_projects_post_route" {
  api_id = data.terraform_remote_state.shared.outputs.api_gateway_id

  route_key          = "POST /projects"
  target             = "integrations/${aws_apigatewayv2_integration.from_the_hart_projects_integration.id}"
  authorizer_id      = data.terraform_remote_state.shared.outputs.api_gateway_cloudfront_token_authorizer_id
  authorization_type = "CUSTOM"
}

resource "aws_apigatewayv2_route" "from_the_hart_projects_put_route" {
  api_id = data.terraform_remote_state.shared.outputs.api_gateway_id

  route_key          = "PUT /projects"
  target             = "integrations/${aws_apigatewayv2_integration.from_the_hart_projects_integration.id}"
  authorizer_id      = data.terraform_remote_state.shared.outputs.api_gateway_cloudfront_token_authorizer_id
  authorization_type = "CUSTOM"
}

resource "aws_apigatewayv2_route" "from_the_hart_projects_delete_route" {
  api_id = data.terraform_remote_state.shared.outputs.api_gateway_id

  route_key          = "DELETE /projects"
  target             = "integrations/${aws_apigatewayv2_integration.from_the_hart_projects_integration.id}"
  authorizer_id      = data.terraform_remote_state.shared.outputs.api_gateway_cloudfront_token_authorizer_id
  authorization_type = "CUSTOM"
}

resource "aws_lambda_permission" "from_the_hart_projects_lambda_permission" {
  statement_id  = "AllowExecutionFromAPIGatewayForFromTheHartProjects"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.from_the_hart_projects_lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${data.terraform_remote_state.shared.outputs.api_gateway_execution_arn}/dev/*"
}

resource "aws_cloudwatch_log_group" "from_the_hart_projects_log_group" {
  name = "/aws/lambda/${aws_lambda_function.from_the_hart_projects_lambda_function.function_name}"

  retention_in_days = 1
}