class NotificationService {
  sendNotification(
    title,
    message
  ) {
    console.log(
      `[NOTIFICATION] ${title}`
    );

    console.log(message);

    return {
      success: true,
      title,
      message
    };
  }

  sendIncidentAlert(
    incidentId
  ) {
    return {
      success: true,
      message:
        `Alert Sent For ${incidentId}`
    };
  }

  sendEscalationAlert(
    escalationId
  ) {
    return {
      success: true,
      message:
        `Escalation Sent For ${escalationId}`
    };
  }
}

module.exports =
  new NotificationService();