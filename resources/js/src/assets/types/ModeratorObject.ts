type ModeratorObject = {
    id: number
    name: string,
    login_email: string|null,
    notification_email: string|null,
    telegram_chat_id: string|null,
    online_status: boolean
}

export default ModeratorObject