VERSION = (0, 6, 2)
 
 
def get_version():
    "Return the version as a human-format string."
    return ".".join([str(i) for i in VERSION])
 