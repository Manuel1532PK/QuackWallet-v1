**URL SITE WEB PROYECTO**

**Manuel Jose Rivera Guzman**

**Juan Sebastián Calderon Martinez**

www.billeteraVirtualPersona.com/home GET "El usuario puede ingresa a la sitio y puede entrar o registrar una cuenta"

www.billeteraVirtualPersona.com/auth/register POST "URL de autenticación de registros, para crear una cuenta"

www.billeteraVirtualPersona.com/auth/login POST "URL de autenticación de Login, para ingresar a la cuenta"

www.billeteraVirtualPersona.com/auth/forgot-password POST "URL de autenticación, el usuario solicita un reset de la contraseña mediante el correo(Este le llega un token para restablecer la contraseña)"

www.billeteraVirtualPersona.com/auth/reset\_password POST "URL de autenticación restablecer contraseña, el usaurio mediante un token crea y envia una nueva contraseña"

www.billeteraVirtualPersona.com/account/balance GET "URL con la cuenta, obtiene o consulta el balance que tiene el usuario"

www.billeteraVirtualPersona.com/account/transfer POST "URL con la cuenta, permite al usuario puede realizar trasferencias"

www.billeteraVirtualPersona.com/account/transfer/history POST "URL con la cuenta, obtiene o consulta el historia de trasferencias que ha realizado el usuario"

www.billeteraVirtualPersona.com/account/withdraw POST "URL con la cuenta, Permite que el usuario realice retiros de su cuenta"

www.billeteraVirtualPersona.com/account/withdraw/history GET "URL con la cuenta, Obitiene y consulta el historia de retiros que ha realizado el usuario"

www.billeteraVirtualPersona.com/account/deposit POST "URL con la cuenta, Permite al usaurio realizar depositos a su cuenta"

www.billeteraVirtualPersona.com/account/deposit/history GET "URL con la cuenta, Consulta el historial de depositos que ha realizado el usuario "

www.billeteraVirtualPersona.com/account/transactions GET "URL con la cuenta, consulta el historial completo de (transfer,withdraw y deposit) que se han realizado en las cuneta del usuario"

www.billeteraVirtualPersona.com/account/logout POST "URL con la cuenta, Cerrar sesion"

www.billeteraVirtualPersona.com/users/updatepassword/ID=? PUT "URL de la cuenta de usuario, mediante la id que se le ha asignado al crear la cuenta,

el usuario puede actualizar su contraseña cuando ya inicio session o este dentro"

www.billeteraVirtualPersona.com/users/update/ID=? PUT "URL de la cuenta de usuario, mediante la id que se le ha asignado al crear la cuenta,

el usaurio puede actualizar infomracion personal"

www.billeteraVirtualPersona.com/users/profile/ID=? GET "URL de la cuenta de usuario, mediante la id que se le ha asignado al crear la cuenta,

Consulta o permite visualizar inforamacion del usuario"
