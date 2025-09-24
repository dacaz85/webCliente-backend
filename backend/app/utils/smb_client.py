# app/utils/smb_client.py
from smb.SMBConnection import SMBConnection
from smb.smb_structs import OperationFailure
import time

class SMBClient:
    def __init__(self, server, port=139, user='', password='', domain='', max_retries=5, retry_delay=5):
        self.server = server
        self.port = port
        self.user = user
        self.password = password
        self.domain = domain
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.conn = SMBConnection(user, password, 'client', domain, use_ntlm_v2=True)
        self.connected = False
        self._connect()

    def _connect(self):
        attempt = 0
        while not self.connected and attempt < self.max_retries:
            attempt += 1
            try:
                if self.conn.connect(self.server, self.port):
                    self.connected = True
                    break
            except Exception as e:
                time.sleep(self.retry_delay)
        if not self.connected:
            raise ConnectionError(f"No se pudo conectar a {self.server} después de {self.max_retries} intentos")

    def list_files(self, share_name, folder_path=''):
        if not self.connected:
            raise ConnectionError("No conectado al servidor SMB")
        try:
            files = self.conn.listPath(share_name, folder_path)
            return [f.filename for f in files if f.filename not in ['.', '..']]
        except OperationFailure as e:
            raise

    def download_file(self, share_name, remote_path, local_path):
        if not self.connected:
            raise ConnectionError("No conectado al servidor SMB")
        normalized_remote = remote_path.replace("\\", "/").lstrip("/")
        with open(local_path, 'wb') as f:
            self.conn.retrieveFile(share_name, normalized_remote, f)
