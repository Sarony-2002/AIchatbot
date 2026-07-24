{
  "nbformat": 4,
  "nbformat_minor": 0,
  "metadata": {
    "colab": {
      "provenance": [],
      "gpuType": "V5E1",
      "authorship_tag": "ABX9TyM1Y0rmhuFU87k5/hYhVbil",
      "include_colab_link": true
    },
    "kernelspec": {
      "name": "python3",
      "display_name": "Python 3"
    },
    "language_info": {
      "name": "python"
    },
    "accelerator": "TPU"
  },
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {
        "id": "view-in-github",
        "colab_type": "text"
      },
      "source": [
        "<a href=\"https://colab.research.google.com/github/Sarony-2002/AIchatbot/blob/main/HiStudent.py\" target=\"_parent\"><img src=\"https://colab.research.google.com/assets/colab-badge.svg\" alt=\"Open In Colab\"/></a>"
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "!pip install streamlit --ignore-installed"
      ],
      "metadata": {
        "id": "KZM59hCPsbmq"
      },
      "execution_count": null,
      "outputs": []
    },
    {
      "cell_type": "code",
      "execution_count": 1,
      "metadata": {
        "colab": {
          "base_uri": "https://localhost:8080/"
        },
        "id": "sDpUJ2-UnjKe",
        "outputId": "3ba3db4b-d7e5-497d-9df6-791feed95bb1"
      },
      "outputs": [
        {
          "output_type": "stream",
          "name": "stdout",
          "text": [
            "Overwriting app.py\n"
          ]
        }
      ],
      "source": [
        "%%writefile app.py\n",
        "import streamlit as st\n",
        "import pandas as pd\n",
        "import numpy as np\n",
        "\n",
        "st.title(\"🚀 My First Cross-Major Streamlit App\")\n",
        "st.write(\"Welcome! Modify the widgets below to see how interactive web apps work.\")\n",
        "\n",
        "user_name = st.text_input(\"What is your name?\", \"Student\")\n",
        "st.subheader(f\"Hello, {user_name}! 👋\")\n",
        "\n",
        "number = st.slider(\"Select a number of data points\", 10, 100, 50)\n",
        "\n",
        "data = pd.DataFrame(\n",
        "    np.random.randn(number, 2),\n",
        "    columns=['X Factor', 'Y Factor']\n",
        ")\n",
        "\n",
        "st.line_chart(data)"
      ]
    },
    {
      "cell_type": "code",
      "source": [
        "# 1. Download Cloudflare Tunnel binary\n",
        "!wget -q -O cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64\n",
        "!chmod +x cloudflared\n",
        "\n",
        "# 2. Run Streamlit in the background\n",
        "!streamlit run app.py &>/dev/null &\n",
        "\n",
        "# 3. Expose Streamlit port 8501 via Cloudflare\n",
        "!./cloudflared tunnel --url http://localhost:8501"
      ],
      "metadata": {
        "id": "eej40lA3rQQz",
        "outputId": "d92019db-9336-4c59-fa50-2e9d6ad24267",
        "colab": {
          "base_uri": "https://localhost:8080/"
        }
      },
      "execution_count": 2,
      "outputs": [
        {
          "output_type": "stream",
          "name": "stdout",
          "text": [
            "\u001b[90m2026-07-24T19:52:24Z\u001b[0m \u001b[32mINF\u001b[0m Thank you for trying Cloudflare Tunnel. Doing so, without a Cloudflare account, is a quick way to experiment and try it out. However, be aware that these account-less Tunnels have no uptime guarantee, are subject to the Cloudflare Online Services Terms of Use (https://www.cloudflare.com/website-terms/), and Cloudflare reserves the right to investigate your use of Tunnels for violations of such terms. If you intend to use Tunnels in production you should use a pre-created named tunnel by following: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps\n",
            "\u001b[90m2026-07-24T19:52:24Z\u001b[0m \u001b[32mINF\u001b[0m Requesting new quick Tunnel on trycloudflare.com...\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m +--------------------------------------------------------------------------------------------+\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m |  https://comes-metabolism-valley-curve.trycloudflare.com                                   |\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m +--------------------------------------------------------------------------------------------+\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Cannot determine default configuration path. No file [config.yml config.yaml] in [~/.cloudflared ~/.cloudflare-warp ~/cloudflare-warp /etc/cloudflared /usr/local/etc/cloudflared]\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Version 2026.7.3 (Checksum 9d71c677db00134c1bd4144b7783486b654ad281b1ea62b4972098d19f770f17)\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m GOOS: linux, GOVersion: go1.26.4, GoArch: amd64\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Settings: map[ha-connections:1 protocol:quic url:http://localhost:8501]\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m cloudflared will not automatically update when run from the shell. To enable auto-updates, run cloudflared as a service: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/configure-tunnels/local-management/as-a-service/\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Generated Connector ID: 936e9119-44b8-4cc5-ac77-6f20d353927c\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Initial protocol quic\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m ICMP proxy will use 172.28.0.12 as source for IPv4\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m ICMP proxy will use ::1 in zone lo as source for IPv6\n",
            "2026/07/24 19:52:30 failed to sufficiently increase receive buffer size (was: 208 kiB, wanted: 7168 kiB, got: 416 kiB). See https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes for details.\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m ICMP proxy will use 172.28.0.12 as source for IPv4\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m ICMP proxy will use ::1 in zone lo as source for IPv6\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Starting metrics server on 127.0.0.1:20241/metrics\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Tunnel connection curve preferences: [X25519MLKEM768 CurveID(65074) CurveP256] \u001b[36mconnIndex=\u001b[0m0 \u001b[36mevent=\u001b[0m0 \u001b[36mip=\u001b[0m198.41.192.167\n",
            "\u001b[90m2026-07-24T19:52:30Z\u001b[0m \u001b[32mINF\u001b[0m Registered tunnel connection \u001b[36mconnIndex=\u001b[0m0 \u001b[36mconnection=\u001b[0mc771801c-26ca-4a8a-b12e-7312db4b8f6c \u001b[36mevent=\u001b[0m0 \u001b[36mip=\u001b[0m198.41.192.167 \u001b[36mlocation=\u001b[0mams07 \u001b[36mprotocol=\u001b[0mquic\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m +-------------------------------------------------------------------------------------+\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |                               CONNECTIVITY PRE-CHECKS                               |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m +-------------------------------------------------------------------------------------+\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  COMPONENT         TARGET                     STATUS  DETAILS                       |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  DNS Resolution    region1.v2.argotunnel.com  PASS    DNS Resolved successfully     |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  DNS Resolution    region2.v2.argotunnel.com  PASS    DNS Resolved successfully     |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  UDP Connectivity  region1.v2.argotunnel.com  PASS    QUIC connection successful    |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  UDP Connectivity  region2.v2.argotunnel.com  PASS    QUIC connection successful    |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  TCP Connectivity  region1.v2.argotunnel.com  PASS    HTTP/2 connection successful  |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  TCP Connectivity  region2.v2.argotunnel.com  PASS    HTTP/2 connection successful  |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  Cloudflare API    api.cloudflare.com:443     PASS    API is reachable              |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |                                                                                     |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m |  SUMMARY: Environment is healthy. cloudflared will use 'quic' as primary protocol.  |\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m +-------------------------------------------------------------------------------------+\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"DNS Resolution\" \u001b[36mdetails=\u001b[0m\"DNS Resolved successfully\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mregion1.v2.argotunnel.com\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"DNS Resolution\" \u001b[36mdetails=\u001b[0m\"DNS Resolved successfully\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mregion2.v2.argotunnel.com\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"UDP Connectivity\" \u001b[36mdetails=\u001b[0m\"QUIC connection successful\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mregion1.v2.argotunnel.com\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"UDP Connectivity\" \u001b[36mdetails=\u001b[0m\"QUIC connection successful\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mregion2.v2.argotunnel.com\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"TCP Connectivity\" \u001b[36mdetails=\u001b[0m\"HTTP/2 connection successful\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mregion1.v2.argotunnel.com\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"TCP Connectivity\" \u001b[36mdetails=\u001b[0m\"HTTP/2 connection successful\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mregion2.v2.argotunnel.com\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck \u001b[36mcomponent=\u001b[0m\"Cloudflare API\" \u001b[36mdetails=\u001b[0m\"API is reachable\" \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36mstatus=\u001b[0mpass \u001b[36mtarget=\u001b[0mapi.cloudflare.com:443\n",
            "\u001b[90m2026-07-24T19:52:36Z\u001b[0m \u001b[32mINF\u001b[0m precheck complete \u001b[36mhard_fail=\u001b[0mfalse \u001b[36mrun_id=\u001b[0m8d418a5f-736b-4589-bd98-a625454c5e16 \u001b[36msuggested_protocol=\u001b[0mquic\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[32mINF\u001b[0m Initiating graceful shutdown due to signal interrupt ...\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[1m\u001b[31mERR\u001b[0m\u001b[0m failed to run the datagram handler \u001b[31merror=\u001b[0m\u001b[31m\"Application error 0x0 (remote)\"\u001b[0m \u001b[36mconnIndex=\u001b[0m0 \u001b[36mevent=\u001b[0m0 \u001b[36mip=\u001b[0m198.41.192.167\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[1m\u001b[31mERR\u001b[0m\u001b[0m failed to serve tunnel connection \u001b[31merror=\u001b[0m\u001b[31m\"accept stream listener encountered a failure while serving\"\u001b[0m \u001b[36mconnIndex=\u001b[0m0 \u001b[36mevent=\u001b[0m0 \u001b[36mip=\u001b[0m198.41.192.167\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[1m\u001b[31mERR\u001b[0m\u001b[0m Serve tunnel error \u001b[31merror=\u001b[0m\u001b[31m\"accept stream listener encountered a failure while serving\"\u001b[0m \u001b[36mconnIndex=\u001b[0m0 \u001b[36mevent=\u001b[0m0 \u001b[36mip=\u001b[0m198.41.192.167\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[32mINF\u001b[0m Retrying connection in up to 1s \u001b[36mconnIndex=\u001b[0m0 \u001b[36mevent=\u001b[0m0 \u001b[36mip=\u001b[0m198.41.192.167\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[1m\u001b[31mERR\u001b[0m\u001b[0m Connection terminated \u001b[36mconnIndex=\u001b[0m0\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[1m\u001b[31mERR\u001b[0m\u001b[0m no more connections active and exiting\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[32mINF\u001b[0m Tunnel server stopped\n",
            "\u001b[90m2026-07-24T19:55:44Z\u001b[0m \u001b[32mINF\u001b[0m Metrics server stopped\n"
          ]
        }
      ]
    }
  ]
}