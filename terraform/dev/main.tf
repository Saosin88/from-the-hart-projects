variable "lambda_image_uri" {
  description = "ECR image URI for the Lambda function"
  type        = string
}

resource "aws_lambda_function" "from_the_hart_projects_lambda_function" {
  function_name = "from-the-hart-projects-dev"
  package_type  = "Image"
  image_uri     = var.lambda_image_uri
  memory_size   = 256
  timeout       = 10
  role          = data.terraform_remote_state.shared.outputs.from_the_hart_lambda_role_arn
}

resource "aws_lambda_function_url" "from_the_hart_projects_function_url" {
  function_name      = aws_lambda_function.from_the_hart_projects_lambda_function.function_name
  authorization_type = "NONE"
  depends_on = [
    aws_lambda_function.from_the_hart_projects_lambda_function,
  ]
}

resource "aws_cloudwatch_log_group" "from_the_hart_projects_log_group" {
  name = "/aws/lambda/${aws_lambda_function.from_the_hart_projects_lambda_function.function_name}"

  retention_in_days = 1
}