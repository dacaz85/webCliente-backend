import logging
logging.basicConfig(level=logging.DEBUG)

from app.utils.smb_client import SMBClient

def main():
    server_ip = "192.168.1.15"
    username = "webCliente"
    password = "DmD220714"
    share_name = "webClientes"

    smb = SMBClient(server_ip, username, password, share_name)
    try:
        smb.connect()
        print("[+] Conexión SMB3 establecida correctamente")
    except Exception as e:
        print(f"[-] Error al conectar: {e}")
        return

    try:
        files = smb.list_files()
        print(f"[+] Archivos en '{share_name}':")
        for f in files:
            print(f" - {f}")
    except Exception as e:
        print(f"[-] Error al listar archivos: {e}")

if __name__ == "__main__":
    main()
