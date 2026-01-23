def test_about_json(client):
    """Test the /about.json endpoint returns correct JSON structure."""

    response = client.get("/about.json")
    assert response.status_code == 200

    data = response.get_json()

    assert "server" in data
    assert "client" in data

    assert "services" in data["server"]
    assert isinstance(data["server"]["services"], list)
    assert any(s["name"] == "spotify" for s in data["server"]["services"])
