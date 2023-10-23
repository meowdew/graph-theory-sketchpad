from PySide6.QtWidgets import QApplication, QMainWindow
import sys


class AppMainBody(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('Graph Theory Sketchpad')
        self.resize(800, 600)


if __name__ == '__main__':
    app = QApplication(sys.argv)
    window = AppMainBody()
    window.show()
    sys.exit(app.exec())
