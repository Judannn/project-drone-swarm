import sys
import platform
import struct

print("Python version:")
print(sys.version)


print("\nPython executable:")
print(sys.executable)



print("\nIs Python 64-bit?")
print(struct.calcsize('P') * 8 == 64)

print("Endianess")
print(sys.byteorder)

print("\nPlatform:")
print(platform.platform())



print("\nPython path:")

for path in sys.path:
    print(path)