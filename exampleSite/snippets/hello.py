def hello(name: str = "world") -> str:
    """Greet someone. Inlined by the `include-code` shortcode."""
    return f"Hello, {name}!"


if __name__ == "__main__":
    print(hello("Inkstone"))
