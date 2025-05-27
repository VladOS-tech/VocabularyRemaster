<x-mail::message>
# Уведомление

{{ $notification->content }}

@isset($notification->related_model)
<x-mail::button :url="'http://localhost:8000/moderator/' . $notification->related_model . '/' . $notification->related_id">
Перейти к объекту
</x-mail::button>
@endisset

С уважением,<br>
команда «Электронного словаря»
</x-mail::message>
