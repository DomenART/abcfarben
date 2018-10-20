export const catchErrorsNotification = (response) => {
  const { graphQLErrors } = response

  if (graphQLErrors) {
    const message = graphQLErrors.map(error => error.message).join('<br>')

    UIkit.notification(message, {
      status: 'danger'
    })
  }
}