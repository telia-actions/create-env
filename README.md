# Create a .env

---

This action will create a `.env` file in the directory of your choice & with the content of your choice.

```yml
- name: Create .env 🤫
  uses: DeveloperRic/action-create-env@v1.0.2 # set this to the version of your choice
  with:
    # Write your content here if you want. The content will be trimmed & dedent will be applied.
    full_text: |
      PROD=1
      PORT=3000
      API_AUDIENCE=api.mydomain.xyz
    # Specify the directory that the .env file should go in.
    # This defaults to the current directory (i.e. '.')
    directory: ${{ github.workspace }}/server/src
    # Set this if you want the action to look in environment variables for extra content. This input is not required.
    # Note: setting to false or any other value will still enable environment variable lookup.
    # If you don't want this turned on, don't include the input.
    include_env_vars: true
  env:
    # If `include_env_vars` is true, the following environment variables will be written to the .env file as:
    # PROD=${{ secrets.PROD }}
    # ACTION_CREATE_ENV_JOKE: ${{ secrets.ACTION_CREATE_ENV_JOKE }}
    # Note: `full_text` is dumped to the .env file first and subsequently environment variables are dumped.
    #       This means that duplicate entries may exist in the .env file.
    ACTION_CREATE_ENV_PROD: ${{ secrets.PROD }}
    ACTION_CREATE_ENV_ACTION_CREATE_ENV_JOKE: ${{ secrets.ACTION_CREATE_ENV_JOKE }}
```
