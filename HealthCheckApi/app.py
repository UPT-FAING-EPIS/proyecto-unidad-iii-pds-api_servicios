from health_check_api import HealthCheckAPI
from message_notifier import HealthCheckNotifier

account_sid = 'MYACCOUNT'
auth_token = 'MYTOKEN'
from_number = '+14179628485'
to_number = '+51981145791'

health_check_notifier = HealthCheckNotifier(account_sid, auth_token, from_number, to_number)

health_check_api = HealthCheckAPI()
health_check_api.attach_observer(health_check_notifier)

health_check_api.run()
